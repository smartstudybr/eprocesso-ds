eProcesso Design System
Um design system moderno e flexível para aplicações React com Tailwind CSS. Inspirado no shadcn/ui, permite instalar apenas os componentes que você precisa.

✨ Características
🎨 Componentes prontos para uso - Button, Input, Modal, Card e muito mais
🎯 Instalação seletiva - Instale apenas os componentes que precisa
🎨 Customizável - Componentes são copiados para seu projeto, você tem controle total
🌙 Dark mode - Suporte nativo a modo escuro
♿ Acessibilidade - Componentes construídos com Radix UI
🚀 TypeScript - Totalmente tipado
🎨 Tailwind CSS - Styling com classes utilitárias
🚀 Instalação
bash
npm install -g eprocesso-ds
# ou
npx eprocesso-ds@latest init
📖 Uso Rápido
1. Inicializar o projeto
bash
eprocesso-ds init
Este comando irá:

Criar arquivo components.json de configuração
Configurar aliases de importação
Instalar utilitários base
Criar estrutura de pastas
2. Instalar dependências base
bash
npm install clsx tailwind-merge class-variance-authority
3. Adicionar componentes
bash
# Instalar componente específico
eprocesso-ds add button

# Instalar múltiplos componentes
eprocesso-ds add button input card

# Instalação interativa (escolha da lista)
eprocesso-ds add

# Instalar todos os componentes
eprocesso-ds add --all
4. Usar os componentes
tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function App() {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Email" />
        <Input placeholder="Senha" type="password" />
        <Button className="w-full">Entrar</Button>
      </CardContent>
    </Card>
  )
}
📋 Comandos Disponíveis
bash
# Inicializar projeto
eprocesso-ds init

# Listar componentes disponíveis
eprocesso-ds list

# Adicionar componentes
eprocesso-ds add [componente...]

# Adicionar com confirmação automática
eprocesso-ds add button --yes

# Usar alias curto
epds add button input
🎨 Componentes Disponíveis
Formulários
button - Botão com múltiplas variantes
input - Campo de entrada de dados
textarea - Campo de texto multilinha
label - Label para formulários
checkbox - Checkbox estilizado
select - Componente de seleção
Layout
card - Cartão com header, content e footer
separator - Separador visual
tabs - Sistema de abas navegáveis
Feedback
alert - Alertas e notificações
toast - Notificações temporárias
badge - Etiquetas e badges
Overlays
dialog - Modais e diálogos
dropdown-menu - Menus dropdown
Display
avatar - Avatar com fallback
⚙️ Configuração
O arquivo components.json armazena as configurações do seu projeto:

json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
Configuração do Tailwind
Adicione ao seu tailwind.config.js:

javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... mais cores
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
CSS Global
Adicione ao seu arquivo CSS global:

css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... mais variáveis */
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... tema escuro */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
🎯 Exemplos de Uso
Formulário Completo
tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export function LoginForm() {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Fazer Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="seu@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Entrar</Button>
      </CardFooter>
    </Card>
  )
}
Dialog/Modal
tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AlertDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Ação</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Deseja continuar?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
🛠️ Desenvolvimento
Estrutura do Projeto
eprocesso-ds/
├── packages/
│   ├── cli/           # CLI principal
│   └── registry/      # Componentes e configurações
├── examples/          # Exemplos de uso
└── docs/             # Documentação
Contribuindo
Faça fork do projeto
Crie uma branch para sua feature (git checkout -b feature/nova-feature)
Commit suas mudanças (git commit -am 'Add nova feature')
Push para a branch (git push origin feature/nova-feature)
Abra um Pull Request
Adicionando Novos Componentes
Crie o componente em packages/registry/components/[nome]/
Adicione arquivos:
[nome].tsx - O componente
config.json - Configuração do componente
Atualize o registry.json
Exemplo de config.json:

json
{
  "name": "meu-componente",
  "description": "Descrição do componente",
  "dependencies": ["react"],
  "files": [
    {
      "name": "meu-componente.tsx",
      "path": "components/ui/meu-componente.tsx"
    }
  ],
  "registryDependencies": ["utils"]
}
📦 Package Managers
O eprocesso-ds funciona com:

npm (padrão)
yarn
pnpm
A CLI detecta automaticamente qual você está usando baseado nos lock files.

🤝 Suporte
📧 Email: suporte@eprocesso-ds.com
🐛 Issues: GitHub Issues
💬 Discussões: GitHub Discussions
📄 Licença
MIT License - veja LICENSE para mais detalhes.

🙏 Agradecimentos
shadcn/ui - Inspiração e conceito
Radix UI - Componentes primitivos
Tailwind CSS - Framework CSS
Lucide React - Ícones


Feito com ❤️ pela equipe RCDC8|Serpro