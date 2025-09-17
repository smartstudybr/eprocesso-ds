export interface Config {
  style: 'default' | 'new-york';
  rsc: boolean;
  tsx: boolean;
  tailwind: {
    config: string;
    css: string;
    baseColor: string;
    cssVariables: boolean;
    prefix: string;
  };
  aliases: {
    components: string;
    utils: string;
  };
}

export interface ComponentFile {
  name: string;
  path: string;
  content?: string;
}

export interface ComponentInfo {
  name: string;
  description: string;
  dependencies: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: ComponentFile[];
  type?: 'components:ui' | 'components:component' | 'components:example';
}

export interface Registry {
  components: Record<string, ComponentInfo>;
  lib: Record<string, ComponentInfo>;
}

export interface InstallOptions {
  yes?: boolean;
  all?: boolean;
  components?: string[];
}