import fs from 'fs-extra';
import path from 'path';
import { Config } from '../types';

export const COMPONENTS_JSON = 'components.json';

export async function getConfig(cwd: string = process.cwd()): Promise<Config | null> {
  const configPath = path.resolve(cwd, COMPONENTS_JSON);
  
  if (!(await fs.pathExists(configPath))) {
    return null;
  }

  try {
    const config = await fs.readJson(configPath);
    return config as Config;
  } catch (error) {
    throw new Error(`Erro ao ler configuração: ${error}`);
  }
}

export async function writeConfig(config: Config, cwd: string = process.cwd()): Promise<void> {
  const configPath = path.resolve(cwd, COMPONENTS_JSON);
  
  try {
    await fs.writeJson(configPath, config, { spaces: 2 });
  } catch (error) {
    throw new Error(`Erro ao salvar configuração: ${error}`);
  }
}

export function resolveAlias(alias: string, config: Config): string {
  const aliasPath = alias.replace('@/', '');
  return path.resolve(process.cwd(), aliasPath);
}

export async function getPackageManager(): Promise<'npm' | 'yarn' | 'pnpm'> {
  // Verifica se existe lock files para determinar o package manager
  if (await fs.pathExists('pnpm-lock.yaml')) {
    return 'pnpm';
  }
  
  if (await fs.pathExists('yarn.lock')) {
    return 'yarn';
  }
  
  return 'npm';
}