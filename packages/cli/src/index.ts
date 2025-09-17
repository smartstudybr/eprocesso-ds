#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';

const program = new Command();

program
  .name('eprocesso-ds')
  .description('CLI para instalar componentes do eProcesso Design System')
  .version('1.0.0');

// Comando para inicializar o projeto
program
  .command('init')
  .description('Inicializa o eProcesso DS no seu projeto')
  .option('-y, --yes', 'Pular confirmações e usar valores padrão')
  .action(initCommand);

// Comando para adicionar componentes
program
  .command('add')
  .description('Adiciona um componente ao projeto')
  .argument('[components...]', 'Nomes dos componentes para adicionar')
  .option('-a, --all', 'Instalar todos os componentes')
  .option('-y, --yes', 'Pular confirmações')
  .action(addCommand);

// Comando para listar componentes disponíveis
program
  .command('list')
  .description('Lista todos os componentes disponíveis')
  .action(listCommand);

// Comando de ajuda customizado
program.on('--help', () => {
  console.log('');
  console.log(chalk.blue('Exemplos:'));
  console.log('  $ eprocesso-ds init');
  console.log('  $ eprocesso-ds add button input');
  console.log('  $ eprocesso-ds add --all');
  console.log('  $ eprocesso-ds list');
  console.log('');
  console.log(chalk.blue('Aliases:'));
  console.log('  Você também pode usar "epds" como alias');
  console.log('  $ epds add button');
});

program.parse();