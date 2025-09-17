# 🚀 Guia de Deploy - eProcesso Design System

## Pré-requisitos

1. **Conta NPM**: Para publicar o pacote CLI
2. **GitHub Repository**: Para hospedar o registry de componentes
3. **Domínio (opcional)**: Para CDN personalizado

## 1. Preparação do Ambiente

### Estrutura de arquivos
```
eprocesso-ds/
├── packages/
│   ├── cli/
│   │   ├── src/
│   │   ├── dist/            # Gerado pelo build
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── registry/
│       ├── components/      # Componentes .tsx
│       ├── registry.json    # Index dos componentes
│       └── lib/
├── scripts/
├── package.json
└── README.md
```

## 2. Build e Publicação do CLI

### Configurar package.json da CLI

```json
{
  "name": "eprocesso-ds",
  "version": "1.0.0",
  "description": "Design System CLI para componentes React + Tailwind",
  "main": "dist/index.js",
  "bin": {
    "eprocesso-ds": "dist/index.js",
    "epds": "dist/index.js"
  },
  "files": [
    "dist/**/*",
    "README.md"
  ],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "react",
    "tailwindcss",
    "design-system",
    "ui-components",
    "cli"
  ],
  "author": "Sua Empresa",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/seu-usuario/eprocesso-ds.git"
  }
}
```

### Build e publicação

```bash
# 1. Build do projeto
cd packages/cli
npm run build

# 2. Login no NPM
npm login

# 3. Publicar versão inicial
npm publish

# 4. Para atualizações futuras
npm version patch  # ou minor/major
npm publish
```

## 3. Hospedar Registry no GitHub

### 1. Criar repositório público no GitHub
```
https://github.com/seu-usuario/eprocesso-ds
```

### 2. Estrutura do registry
```
packages/registry/
├── components/
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
├── lib/
│   └── utils.ts
└── registry.json
```

### 3. Configurar URLs no código da CLI

No arquivo `packages/cli/src/utils/registry.ts`:

```typescript
// Altere a URL base para o seu repositório
const REGISTRY_BASE_URL = 'https://raw.githubusercontent.com/seu-usuario/eprocesso-ds/main/packages/registry';
```

## 4. Automatização com GitHub Actions

Crie `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build CLI
        run: |
          cd packages/cli
          npm run build
      
      - name: Publish to NPM
        run: |
          cd packages/cli
          npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 5. CDN Personalizado (Opcional)

### Usando Vercel

1. **Deploy no Vercel**:
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Configurar domínio personalizado**:
   ```
   https://cdn.eprocesso-ds.com
   ```

3. **Atualizar URLs na CLI**:
   ```typescript
   const REGISTRY_BASE_URL = 'https://cdn.eprocesso-ds.com/packages/registry';
   ```

### Usando GitHub Pages

1. **Configurar GitHub Pages** no repositório
2. **URL será**: `https://seu-usuario.github.io/eprocesso-ds/packages/registry`

## 6. Versionamento e Releases

### Estratégia de Versionamento (SemVer)

- **Major (1.0.0)**: Breaking changes
- **Minor (1.1.0)**: Novos componentes/features
- **Patch (1.0.1)**: Bug fixes

### Script de release

```bash
#!/bin/bash
# scripts/release.sh

set -e

echo "🚀 Iniciando processo de release..."

# Build
echo "📦 Building CLI..."
cd packages/cli
npm run build
cd ../..

# Validar registry
echo "✅ Validando registry..."
node scripts/validate-registry.js

# Criar tag
VERSION=$(node -p "require('./packages/cli/package.json').version")
echo "🏷️  Criando tag v$VERSION..."
git tag "v$VERSION"

# Push
echo "📤 Fazendo push..."
git push origin "v$VERSION"
git push origin main

echo "✅ Release concluído!"
```

## 7. Monitoramento e Analytics

### NPM Download Stats
```bash
# Ver downloads do pacote
npm view eprocesso-ds downloads
```

### GitHub Insights
- Acompanhar stars, forks, issues
- Monitorar traffic no repositório

## 8. Documentação e Site

### Opções para documentação:
1. **GitHub Pages** - Simples e gratuito
2. **Vercel/Netlify** - Mais features
3. **Docusaurus** - Framework para docs
4. **Storybook** - Para showcase dos componentes

### Exemplo com Docusaurus:

```bash
npx create-docusaurus@latest docs classic --typescript
cd docs
npm start
```

## 9. Checklist de Lançamento

### Pré-lançamento
- [ ] Todos os componentes testados
- [ ] CLI funcionando em diferentes sistemas
- [ ] Documentação completa
- [ ] README atualizado
- [ ] Exemplos funcionais

### Lançamento
- [ ] Pacote publicado no NPM
- [ ] Registry hospedado e acessível
- [ ] GitHub release criado
- [ ] Documentação publicada

### Pós-lançamento
- [ ] Monitorar issues
- [ ] Responder feedback
- [ ] Planejar próximas features
- [ ] Atualizar dependências

## 10. Exemplo de Comandos Finais

```bash
# 1. Clone e setup inicial
git clone https://github.com/seu-usuario/eprocesso-ds
cd eprocesso-ds
npm install

# 2. Build e test
npm run build
npm test

# 3. Publicar
npm run release

# 4. Testar instalação
npx eprocesso-ds@latest init
npx eprocesso-ds@latest add button
```

## 🎯 Próximos Passos

Após o lançamento inicial, considere:

1. **Templates de projetos** - Criar templates Next.js, Vite, etc.
2. **Temas personalizados** - Múltiplos temas visuais
3. **Componentes avançados** - Data tables, charts, etc.
4. **Plugins** - Sistema de plugins para extensibilidade
5. **Dashboard** - Interface web para gerenciar componentes

---

**Dica**: Comece simples e vá evoluindo baseado no feedback da comunidade!