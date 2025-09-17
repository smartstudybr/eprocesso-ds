import chalk from 'chalk';
import ora from 'ora';
import { fetchRegistry } from '../utils/registry';

export async function listCommand(): Promise<void> {
  const spinner = ora('Buscando componentes disponíveis...').start();

  try {
    const registry = await fetchRegistry();
    spinner.succeed();

    console.log('\n' + chalk.blue('📦 Componentes Disponíveis:\n'));

    // Listar componentes UI
    const components = Object.values(registry.components);
    if (components.length > 0) {
      console.log(chalk.bold('🎨 Componentes UI:'));
      components.forEach(component => {
        console.log(`  ${chalk.green('●')} ${chalk.bold(component.name)} - ${chalk.gray(component.description)}`);
      });
      console.log('');
    }

    // Listar utilitários
    const libs = Object.values(registry.lib);
    if (libs.length > 0) {
      console.log(chalk.bold('🔧 Utilitários:'));
      libs.forEach(lib => {
        console.log(`  ${chalk.blue('●')} ${chalk.bold(lib.name)} - ${chalk.gray(lib.description)}`);
      });
      console.log('');
    }

    console.log(chalk.blue('💡 Uso:'));
    console.log('  eprocesso-ds add button input    # Instalar componentes específicos');
    console.log('  eprocesso-ds add --all           # Instalar todos os componentes');
    console.log('  eprocesso-ds add                 # Seleção interativa');

  } catch (error) {
    spinner.fail('Erro ao buscar componentes');
    console.error(chalk.red('Verifique sua conexão com a internet e tente novamente.'));
    console.error(chalk.gray(`Erro: ${error}`));
  }
}