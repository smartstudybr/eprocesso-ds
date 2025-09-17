// scripts/sync-registry.js - Script para sincronizar componentes
const fs = require('fs-extra');
const path = require('path');

async function syncRegistry() {
  const registryPath = path.join(__dirname, '../packages/registry');
  const componentsPath = path.join(registryPath, 'components');
  
  // Ler todos os componentes
  const components = {};
  const componentDirs = await fs.readdir(componentsPath);
  
  for (const dir of componentDirs) {
    const configPath = path.join(componentsPath, dir, 'config.json');
    if (await fs.pathExists(configPath)) {
      const config = await fs.readJson(configPath);
      components[dir] = config;
    }
  }
  
  // Atualizar registry.json
  const registryFile = path.join(registryPath, 'registry.json');
  const currentRegistry = await fs.readJson(registryFile);
  
  currentRegistry.components = components;
  
  await fs.writeJson(registryFile, currentRegistry, { spaces: 2 });
  console.log('Registry sincronizado com sucesso!');
}

if (require.main === module) {
  syncRegistry().catch(console.error);
}

module.exports = { syncRegistry };