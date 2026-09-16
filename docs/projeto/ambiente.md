# Ambiente

Comandos verificados de verdade (rodados e conferidos, não presumidos a partir
do `package.json`).

## `api/` (Node 22 — CI e local batem)

| Comando | Resultado |
|---|---|
| `npm ci` | instala do zero; se o lock estiver desatualizado, fallback pra `npm install` |
| `npm test` (`NODE_ENV=test JWT_SECRET=... node --test`) | 11 testes, todos passando; banco isolado (`:memory:`) via `NODE_ENV=test`, não suja o SQLite de dev |
| `npm run dev` (`nodemon index.js`) | sobe em `http://localhost:4000/`, reload automático |
| `npm start` (`node index.js`) | mesma porta, sem reload |
| `npm run build` | **não existe** — API roda ESM direto no Node, sem bundling. `npm error Missing script: "build"` é o esperado, não é falha. |

`.env`/`.env.example`: `PORT=4000` e `JWT_SECRET=<segredo>`. `PORT` é
opcional (cai em `4000` se faltar), mas **`JWT_SECRET` é obrigatório** desde a
tarefa 16 — `autenticacao.js` lança erro na importação (`npm run
dev`/`npm start`/testes sem a env crasham) se não estiver definido. `npm
test` já exporta um `JWT_SECRET` de teste embutido no script; rodar `node
--test` direto sem isso falha.

## `web/` (CI fixa Node 20; ambiente local testado em Node 22 sem problema —
divergência não travada por `engines` em nenhum `package.json`, atenção se
algo quebrar especificamente em Node 20)

| Comando | Resultado |
|---|---|
| `npm ci` | instala do zero |
| `npm run lint` (`oxlint`) | limpo, exit 0 |
| `npm test` (`vitest run`) | 10 testes em 2 arquivos, todos passando |
| `npm run build` (`vite build`) | bundle único ~560 kB / 174 kB gzip; aviso de chunk >500 kB (sem code-splitting, nenhum `React.lazy` no projeto) |
| `npm run dev` | Vite em `http://localhost:5173/` |
| `npm run preview` | **`http://localhost:4173/`, não 5173** — só funciona depois de rodar `build` |

`.env`/`.env.example`: `VITE_GRAPHQL_URL=http://localhost:4000/`. Não é
obrigatório — `graphql/client.js` cai nesse mesmo valor como default se
faltar.

Rodar o `web` sem a `api` no ar funciona (a shell React monta), mas toda tela
cai no estado `'erro'` porque as queries falham.

## Ordem oficial de CI (`.github/workflows/ci.yml`)

```
api: npm ci → npm test
web: npm ci → npm run lint → npm test → npm run build
```

Nenhum dos dois jobs sobe `dev`/`preview` — isso é só verificação manual.
