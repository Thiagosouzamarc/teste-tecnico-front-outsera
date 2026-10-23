# MovieAwards

Aplicação desenvolvida com **Angular 15.2.11** para consulta de filmes e informações relacionadas aos vencedores do prêmio.

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- npm, instalado junto com o Node.js
- [Git](https://git-scm.com/)

## Como executar o projeto

### 1. Clonar o repositório

No terminal, execute:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd movie-awards
```

> Substitua `URL_DO_REPOSITORIO` pela URL do repositório Git.

### 2. Instalar as dependências

Execute o comando abaixo na raiz do projeto:

```bash
npm install
```

Esse comando instalará as dependências necessárias para executar a aplicação e os testes.

### 3. Iniciar o servidor de desenvolvimento

Execute:

```bash
npm start
```

O comando iniciará o servidor de desenvolvimento do Angular.

### 4. Acessar a aplicação

Abra o navegador e acesse:

**http://localhost:4200/**

A aplicação estará disponível localmente. Durante o desenvolvimento, as alterações nos arquivos de código serão refletidas automaticamente quando aplicável.

Para encerrar o servidor, pressione `Ctrl + C` no terminal.

## Tecnologias utilizadas

- Angular 15.2.11
- TypeScript 4.9
- Angular Material
- RxJS
- Jest 29
- jest-preset-angular

## Testes unitários

O projeto utiliza **Jest** para executar os testes unitários.

### Executar os testes

```bash
npm test
```

### Executar os testes em modo de observação

```bash
npm run test:watch
```

Nesse modo, o Jest acompanha as alterações e pode executar novamente os testes conforme necessário.

### Executar os testes com cobertura de código

```bash
npm run test:coverage
```

O relatório de cobertura será gerado na pasta `coverage/`, permitindo verificar quais arquivos, funções, linhas e ramificações foram cobertos pelos testes.

Se o relatório HTML estiver disponível, abra o arquivo:

```text
coverage/lcov-report/index.html
```

## Build da aplicação

Para gerar a versão de produção, execute:

```bash
npm run build
```

Os arquivos compilados serão gerados na pasta `dist/`.

Para compilar continuamente durante o desenvolvimento, execute:

```bash
npm run watch
```

## Ajuda adicional

Para consultar os comandos disponíveis no Angular CLI, execute:

```bash
npx ng help
```

Documentação oficial:

- [Angular](https://angular.dev/)
- [Angular CLI](https://angular.dev/tools/cli)
- [Jest](https://jestjs.io/)
- [Angular Material](https://material.angular.io/)
