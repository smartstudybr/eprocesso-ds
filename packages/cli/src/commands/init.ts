import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { Config } from '../types';
import { getConfig, writeConfig, COMPONENTS_JSON } from '../utils/config';

interface InitOptions {
  yes?: boolean;
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.blue('Inicializando eProcesso Design System...\n'));

  // Verifica se já está inicializado
  if (await fs.pathExists(COMPONENTS_JSON)) {
    const override = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'override',
        message: 'Configuração já existe. Deseja sobrescrever?',
        default: false,
      },
    ]);

    if (!override.override) {
      console.log(chalk.yellow('Cancelado.'));
      return;
    }
  }

  let config: Config;

  if (options.yes) {
    // Configuração padrão
    config = {
      style: 'default',
      rsc: false,
      tsx: true,
      tailwind: {
        config: 'tailwind.config.js',
        css: 'app/globals.css',
        baseColor: 'slate',
        cssVariables: true,
        prefix: '',
      },
      aliases: {
        components: '@/components',
        utils: '@/lib/utils',
      },
    };
  } else {
    // Fazer perguntas interativas
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'style',
        message: 'Qual estilo você gostaria de usar?',
        choices: [
          { name: 'Default', value: 'default' },
          { name: 'New York', value: 'new-york' },
        ],
        default: 'default',
      },
      {
        type: 'list',
        name: 'baseColor',
        message: 'Qual cor base você gostaria de usar?',
        choices: [
          { name: 'Slate', value: 'slate' },
          { name: 'Gray', value: 'gray' },
          { name: 'Zinc', value: 'zinc' },
          { name: 'Neutral', value: 'neutral' },
          { name: 'Stone', value: 'stone' },
        ],
        default: 'slate',
      },
      {
        type: 'confirm',
        name: 'cssVariables',
        message: 'Usar variáveis CSS para cores?',
        default: true,
      },
      {
        type: 'input',
        name: 'componentsAlias',
        message: 'Configurar alias para importação de componentes:',
        default: '@/components',
      },
      {
        type: 'input',
        name: 'utilsAlias',
        message: 'Configurar alias para importação de utils:',
        default: '@/lib/utils',
      },
    ]);

    config = {
      style: answers.style,
      rsc: false,
      tsx: true,
      tailwind: {
        config: 'tailwind.config.js',
        css: 'app/globals.css',
        baseColor: answers.baseColor,
        cssVariables: answers.cssVariables,
        prefix: '',
      },
      aliases: {
        components: answers.componentsAlias,
        utils: answers.utilsAlias,
      },
    };
  }

  const spinner = ora('Criando configuração...').start();

  try {
    // Criar diretórios necessários
    const componentsDir = config.aliases.components.replace('@/', '');
    const libDir = path.dirname(config.aliases.utils.replace('@/', ''));

    await fs.ensureDir(componentsDir);
    await fs.ensureDir(libDir);

    // Escrever configuração
    await writeConfig(config);

    // Criar arquivo utils.ts se não existir
    const utilsPath = config.aliases.utils.replace('@/', '') + '.ts';
    if (!(await fs.pathExists(utilsPath))) {
      const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;
      
      await fs.writeFile(utilsPath, utilsContent);
    }

    spinner.succeed(chalk.green('Configuração criada com sucesso!'));

    console.log('\n' + chalk.blue('Próximos passos:'));
    console.log('1. Instalar dependências necessárias:');
    console.log(chalk.gray('   npm install clsx tailwind-merge class-variance-authority'));
    console.log('2. Adicionar componentes:');
    console.log(chalk.gray('   npx eprocesso-ds add button'));
    console.log('3. Começar a usar!');

  } catch (error) {
    spinner.fail(chalk.red('Erro ao criar configuração'));
    console.error(error);
    process.exit(1);
  }
}