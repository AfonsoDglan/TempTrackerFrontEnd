## TempTracker: Sistema de Monitoramento de Temperatura

### Descrição do Projeto

O TempTracker é um sistema de monitoramento de temperatura inteligente projetado para acompanhar a temperatura em múltiplas localidades, emitir alertas automáticos quando os limites predefinidos são excedidos e gerar relatórios detalhados para análise de tendências.

### Funcionalidades Principais

* **Monitoramento em Tempo Real**: Acompanhe as temperaturas de diversas localidades com intervalos de monitoramento configuráveis.
* **Alertas Inteligentes**: Receba notificações instantâneas quando a temperatura ultrapassar os limites de segurança definidos para cada localidade.
* **Relatórios Detalhados**: Acesse históricos completos das leituras de temperatura e visualize tendências para uma análise aprofundada.
* **Gestão de Localidades**: Adicione, edite e ative/desative localidades para monitoramento de forma intuitiva.
* **Exportação de Dados**: Exporte os relatórios de temperatura para CSV para uso externo.

### Como Rodar o Projeto

Para configurar e executar o TempTracker localmente, siga os passos abaixo:

#### Pré-requisitos

Certifique-se de ter o Node.js (versão 18.0.0 ou superior) e o npm (ou yarn) instalados em sua máquina.

#### 1. Clonar o Repositório

```bash
git clone git@github.com:AfonsoDglan/TempTrackerFrontEnd.git
cd TempTrackerFrontEnd
```

#### 2. Instalar Dependências

Instale as dependências do projeto utilizando npm:

```bash
npm i
```

Ou, se preferir usar yarn:

```bash
yarn install
```

#### 3. Configurar Variáveis de Ambiente

O projeto se comunica com uma API local (atualmente configurada para `http://localhost:8000`). Certifique-se de que sua API de backend esteja em execução neste endereço ou atualize as URLs nas seguintes páginas:

* `src/pages/Dashboard.tsx`:
    * `fetch("http://localhost:8000/temperature/api/v1/alerts/")`
    * `fetch("http://localhost:8000/temperature/api/v1/monitor-settings/")`
    * `fetch(\`http://localhost:8000/temperature/api/v1/alerts/confirm/${alertId}/\`)`
* `src/pages/AddLocation.tsx`:
    * `fetch("http://localhost:8000/temperature/api/v1/monitor-settings/", { ... })`
* `src/pages/Reports.tsx`:
    * `fetch("http://localhost:8000/temperature/api/v1/monitor-settings/")`
    * ``fetch(`http://localhost:8000/temperature/api/v1/temperature-readings/?time_range=${selectedPeriod}`)``

#### 4. Rodar o Projeto em Modo de Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Ou:

```bash
yarn dev
```

O aplicativo estará disponível em `http://localhost:8080`.

#### 5. Construir para Produção

Para gerar uma build otimizada para produção:

```bash
npm run build
```

Ou:

```bash
yarn build
```

Os arquivos de produção serão gerados na pasta `dist/`.

#### Scripts Adicionais

* **`npm run build:dev`**: Compila o projeto em modo de desenvolvimento.
* **`npm run lint`**: Executa o ESLint para verificar problemas de código.
* **`npm run preview`**: Inicia um servidor local para pré-visualizar a build de produção.

### Estrutura do Projeto

* `public/`: Contém arquivos estáticos como `robots.txt`.
* `src/`: Contém o código-fonte principal da aplicação.
    * `assets/`: (Se houver) Imagens, ícones, etc.
    * `components/`: Componentes React reutilizáveis.
        * `ui/`: Componentes de UI (shadcn/ui).
    * `hooks/`: Hooks personalizados (ex: `use-toast.ts`, `use-mobile.tsx`).
    * `lib/`: Funções utilitárias (ex: `utils.ts`).
    * `pages/`: Componentes de página (ex: `Index.tsx`, `Dashboard.tsx`, `AddLocation.tsx`, `Reports.tsx`, `NotFound.tsx`).
    * `App.css`, `App.tsx`, `index.css`, `main.tsx`, `vite-env.d.ts`: Arquivos principais da aplicação e estilos globais.
* `index.html`: O arquivo HTML principal da aplicação.
* `package.json`, `package-lock.json`: Gerenciamento de dependências.
* `postcss.config.js`, `tailwind.config.ts`: Configurações de estilo com PostCSS e Tailwind CSS.
* `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: Configurações do TypeScript.
* `vite.config.ts`: Configuração do Vite.
* `eslint.config.js`: Configuração do ESLint.
