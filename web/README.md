# Wiki de Fãs — Front-end (Avatar: A Lenda de Aang)

Front-end em React + Vite que consome a API GraphQL do projeto (`../api`).
Veja `../projeto.md` para a visão geral do monorepo.

## Rodando localmente

Este front-end precisa da API GraphQL rodando (por padrão em `http://localhost:4000/`).

```bash
# em um terminal, na pasta api/
npm install
npm start

# em outro terminal, na pasta web/
npm install
cp .env.example .env   # ajuste VITE_GRAPHQL_URL se necessário
npm run dev
```

A aplicação sobe em `http://localhost:5173/`.

## Scripts

- `npm run dev` — servidor de desenvolvimento (Vite)
- `npm run build` — build de produção
- `npm run preview` — preview do build
- `npm run lint` — lint (Oxlint)
- `npm test` — testes (Vitest + Testing Library)

## Stack

- React 19 + React Router
- Apollo Client (GraphQL)
- Framer Motion (animações)
