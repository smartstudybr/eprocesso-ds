import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { getConfig, getPackageManager } from '../utils/config';
import { 
  fetchRegistry, 
  resolveDependencies, 
  getAvailableComponents 
} from '../utils/registry';
import { InstallOptions } from '../types';

export async function addCommand(components: string[] = [], options: InstallOptions) {
  // Verificar se o projeto está inicializado
  const config = await getConfig();
  if (!config) {
    console.log(chalk.red('Projeto não inicializado. Execute "eprocesso-ds init" primeiro.'));
    return;
  }

  let componentsToInstall: string[] = [];

  // Se --all foi passado, instalar todos os componentes
  if (options.all) {
    const spinner = ora('Buscando componentes disponíveis...').start();
    
    try {
      const availableComponents = await getAvailableComponents();
      componentsToInstall = availableComponents.filter(name => name !== 'utils'); // utils já foi instalado no init
      spinner.succeed(`Encontrados ${componentsToInstall.length} componentes`);
    } catch (error) {
      spinner.fail('Erro ao buscar componentes');
      console.error(error);
      return;
    }
  } else if (components.length > 0) {
    // Componentes foram especificados
    componentsToInstall = components;
  } else {
    // Mostrar lista interativa
    const spinner = ora('Buscando componentes disponíveis...').start();
    
    try {
      const availableComponents = await getAvailableComponents();
      spinner.succeed();

      const { selectedComponents } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedComponents',
          message: 'Quais componentes você gostaria de instalar?',
          choices: availableComponents
            .filter(name => name !== 'utils')
            .map(name => ({ name, value: name })),
        },
      ]);

      if (selectedComponents.length === 0) {
        console.log(chalk.yellow('Nenhum componente selecionado.'));
        return;
      }

      componentsToInstall = selectedComponents;
    } catch (error) {
      spinner.fail('Erro ao buscar componentes');
      console.error(error);
      return;
    }
  }

  // Confirmar instalação
  if (!options.yes) {
    console.log(`\nSerão instalados os seguintes componentes:`);
    componentsToInstall.forEach(name => {
      console.log(chalk.blue(`  - ${name}`));
    });

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Continuar?',
        default: true,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow('Cancelado.'));
      return;
    }
  }

  const installSpinner = ora('Resolvendo dependências...').start();

  try {
    // Resolver dependências
    const resolvedComponents = await resolveDependencies(componentsToInstall);
    installSpinner.text = 'Instalando componentes...';

    // Instalar cada componente
    for (const component of resolvedComponents) {
      await installComponent(component, config);
    }

    // Instalar dependências NPM
    const allDependencies = new Set<string>();
    const allDevDependencies = new Set<string>();

    resolvedComponents.forEach(component => {
      component.dependencies.forEach(dep => allDependencies.add(dep));
      component.devDependencies?.forEach(dep => allDevDependencies.add(dep));
    });

    if (allDependencies.size > 0) {
      installSpinner.text = 'Instalando dependências NPM...';
      await installNpmDependencies([...allDependencies], false);
    }

    if (allDevDependencies.size > 0) {
      installSpinner.text = 'Instalando dependências de desenvolvimento...';
      await installNpmDependencies([...allDevDependencies], true);
    }

    installSpinner.succeed(chalk.green(`${resolvedComponents.length} componente(s) instalado(s) com sucesso!`));

    // Mostrar resumo
    console.log('\n' + chalk.blue('Componentes instalados:'));
    resolvedComponents.forEach(component => {
      console.log(chalk.green(`  ✓ ${component.name}`));
    });

  } catch (error) {
    installSpinner.fail('Erro durante a instalação');
    console.error(chalk.red(error));
    process.exit(1);
  }
}

async function installComponent(component: any, config: any): Promise<void> {
  for (const file of component.files) {
    if (!file.content) {
      console.warn(chalk.yellow(`Aviso: Conteúdo não disponível para ${file.name}`));
      continue;
    }

    // Determinar caminho de destino
    let targetPath: string;
    
    if (file.path.startsWith('components/')) {
      const relativePath = file.path.replace('components/', '');
      targetPath = path.resolve(
        config.aliases.components.replace('@/', ''), 
        relativePath
      );
    } else if (file.path.startsWith('lib/')) {
      const relativePath = file.path.replace('lib/', '');
      targetPath = path.resolve(
        path.dirname(config.aliases.utils.replace('@/', '')), 
        relativePath
      );
    } else {
      targetPath = path.resolve(process.cwd(), file.path);
    }

    // Criar diretório se não existir
    await fs.ensureDir(path.dirname(targetPath));

    // Processar aliases no conteúdo
    let processedContent = file.content;
    
    // Substituir aliases
    processedContent = processedContent.replace(
      /@\/components/g, 
      config.aliases.components
    );
    processedContent = processedContent.replace(
      /@\/lib\/utils/g, 
      config.aliases.utils
    );

    // Escrever arquivo
    await fs.writeFile(targetPath, processedContent);
  }
}

async function installNpmDependencies(
  dependencies: string[], 
  isDev: boolean = false
): Promise<void> {
  const packageManager = await getPackageManager();
  const devFlag = isDev ? (packageManager === 'npm' ? '--save-dev' : '--dev') : '';
  
  let command: string;
  
  switch (packageManager) {
    case 'pnpm':
      command = `pnpm add ${devFlag} ${dependencies.join(' ')}`;
      break;
    case 'yarn':
      command = `yarn add ${devFlag} ${dependencies.join(' ')}`;
      break;
    default:
      command = `npm install ${devFlag} ${dependencies.join(' ')}`;
  }

  execSync(command, { stdio: 'inherit' });
}