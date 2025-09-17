import fetch from 'node-fetch';
import { Registry, ComponentInfo } from '../types';

// URL base do registry (você pode hospedar no GitHub, Vercel, etc.)
const REGISTRY_BASE_URL = 'https://raw.githubusercontent.com/seu-usuario/eprocesso-ds/main/packages/registry';

export async function fetchRegistry(): Promise<Registry> {
  try {
    const response = await fetch(`${REGISTRY_BASE_URL}/registry.json`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar registry: ${response.statusText}`);
    }
    
    const registry = await response.json() as Registry;
    return registry;
  } catch (error) {
    throw new Error(`Falha ao conectar com o registry: ${error}`);
  }
}

export async function fetchComponent(name: string): Promise<ComponentInfo | null> {
  const registry = await fetchRegistry();
  
  // Busca primeiro em components, depois em lib
  const component = registry.components[name] || registry.lib[name];
  
  if (!component) {
    return null;
  }

  // Busca o conteúdo de cada arquivo
  const filesWithContent = await Promise.all(
    component.files.map(async (file) => {
      try {
        const fileUrl = `${REGISTRY_BASE_URL}/${file.name}`;
        const response = await fetch(fileUrl);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar arquivo ${file.name}`);
        }
        
        const content = await response.text();
        
        return {
          ...file,
          content
        };
      } catch (error) {
        console.warn(`Aviso: Não foi possível buscar o arquivo ${file.name}`);
        return file;
      }
    })
  );

  return {
    ...component,
    files: filesWithContent
  };
}

export async function getAvailableComponents(): Promise<string[]> {
  try {
    const registry = await fetchRegistry();
    return [
      ...Object.keys(registry.components),
      ...Object.keys(registry.lib)
    ];
  } catch (error) {
    return [];
  }
}

export async function resolveDependencies(componentNames: string[]): Promise<ComponentInfo[]> {
  const registry = await fetchRegistry();
  const resolved = new Set<string>();
  const components: ComponentInfo[] = [];

  async function resolveComponent(name: string): Promise<void> {
    if (resolved.has(name)) {
      return;
    }

    const component = registry.components[name] || registry.lib[name];
    if (!component) {
      throw new Error(`Componente "${name}" não encontrado no registry`);
    }

    // Resolver dependências do registry primeiro
    if (component.registryDependencies) {
      for (const dep of component.registryDependencies) {
        await resolveComponent(dep);
      }
    }

    resolved.add(name);
    
    // Buscar conteúdo do componente
    const componentWithContent = await fetchComponent(name);
    if (componentWithContent) {
      components.push(componentWithContent);
    }
  }

  // Resolver todos os componentes solicitados
  for (const name of componentNames) {
    await resolveComponent(name);
  }

  return components;
}