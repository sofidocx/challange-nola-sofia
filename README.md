# Desafio Nola/Arcca - Dashboard de Analytics (por Sofia Vaz)

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Cube.js](https://img.shields.io/badge/Cube.js-Node.js-E63E7F?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Esta é a solução full-stack para o desafio de analytics da Nola/Arcca, projetada para resolver a dor central da usuária (Maria) e transformar 500.000+ registros de vendas em insights acionáveis e instantâneos.

A solução é um **aplicativo de Business Intelligence (BI)** completo, dividido em três páginas:
1.  **Visão Geral (`/`)**: Um dashboard "zero cliques" com os KPIs mais importantes e o "Top 10 Produtos".
2.  **Explorar Dados (`/explorar`)**: Um "construtor de relatórios" (Query Builder) que permite à Maria cruzar métricas, dimensões e filtros dinamicamente.
3.  **Comparar Lojas (`/comparar`)**: Uma ferramenta dedicada para comparar a performance de duas lojas lado a lado.

---

## 🚀 Documentação de Arquitetura

Todo o meu processo de pensamento, decisões técnicas (OLTP vs. OLAP), a escolha da arquitetura de **Camada Semântica (Headless BI)** e a demonstração completa da solução (com prints) estão detalhados neste documento:

### ➡️ **[LEIA O ARQUITETURA.MD COMPLETO AQUI](ARQUITETURA.md)**

---

## 🛠️ Estrutura do Projeto

Este repositório é um "monorepo" contendo 3 projetos principais:

* `/nola-god-level`: O projeto base original do desafio, contendo o gerador de dados Python e o schema do banco.
* `/nola-backend`: O "cérebro" da solução. Um servidor Node.js (Cube.js) que atua como a Camada Semântica, traduzindo perguntas de negócio em queries SQL otimizadas.
* `/nola-frontend`: O "rosto" da solução. Um aplicativo React (Vite + TypeScript) que consome a API do Cube.js e renderiza os dashboards interativos.

---

## 📦 Manual de Instalação e Teste (Local)

Para rodar este projeto em sua máquina local, você precisará ter o **Docker** e o **Node.js** (v18+) instalados.

Siga estes passos a partir da pasta **RAIZ** do projeto (`/NOLA-GOD-LEVEL`).

### Passo 1: Iniciar o Banco de Dados (Docker)

Primeiro, precisamos subir o contêiner do PostgreSQL e popular o banco com os 500.000+ registros de vendas.

### 1. Gerador de dados (Docker)

Navegue até a pasta do gerador de dados e execute os comandos abaixo:

```bash
# Vá para a pasta do gerador de dados
cd nola-god-level
```

```bash
# (Se for a primeira vez) Construa a imagem do gerador de dados
docker compose build --no-cache data-generator
```

```bash
# Inicie o contêiner do PostgreSQL em background
docker compose up -d postgres
```

```bash
# Rode o script de geração de dados (pode levar 5–15 minutos)
docker compose run --rm data-generator
```

```bash
# Volte para a pasta raiz do monorepo
cd ..
```

> Observação: após estes comandos, o Postgres deve estar rodando na porta 5432 com ~500k+ registros.

---

### 2. Iniciar o Back-end (Cube.js)

Em um novo terminal, execute:

```bash
# Entre na pasta do back-end
cd nola-backend
```

```bash
# Instale dependências
npm install
```

```bash
# Inicie o servidor de desenvolvimento (Cube.js)
npm run dev
```

> URL do back-end: http://localhost:4000

---

### 3. Iniciar o Front-end (React)

Em outro terminal, execute:

```bash
# Entre na pasta do front-end
cd nola-frontend
```

```bash
# Instale dependências (usa --legacy-peer-deps para contornar conflitos de peer)
npm install --legacy-peer-deps
```

```bash
# Inicie o servidor de desenvolvimento (Vite)
npm run dev
```

> URL do front-end: http://localhost:5173

#Passo 4: Testar a Solução
###Abra seu navegador e acesse:

➡️ http://localhost:5173/

#Você verá o dashboard completo e funcional:

###Teste a "Visão Geral" (/): Veja os KPIs e o "Top 10" carregarem automaticamente.

###Teste o "Explorar Dados" (/explorar): Brinque com os 3 dropdowns (Métrica, Dimensão, Filtro) e teste o botão "Exportar para Excel (CSV)".

###Teste o "Comparar Lojas" (/comparar): Selecione duas lojas e veja o gráfico de comparação ser gerado instantaneamente.