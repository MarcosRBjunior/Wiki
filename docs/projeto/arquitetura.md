# Arquitetura

## O que é

Wiki de fãs de Avatar: A Lenda de Aang — listagem e detalhe de personagens via
GraphQL, mais um mural de lore do mundo (nações, lugares, celebrações, datas
marcantes). Escopo completo, board de tasks e estratégia de branch estão em
`projeto.md`, na raiz do repo — este documento não repete aquilo, só cobre a
implementação real.

## Pra quem

Uso solo. Sem revisor humano externo além do próprio autor — pode ser direto e
técnico, sem explicar o óbvio.

## Monorepo

```
api/   Node 22, GraphQL-only via Apollo Server 5, somente leitura (sem Mutation)
web/   React 19 + Vite 8 + Apollo Client 4 + React Router 7 + Framer Motion
```

## `api/` — camadas

```
index.js                        entrypoint: carrega .env, seed, sobe Apollo Server
  └─ graphql/typeDefs.js         schema (Personagem, Query: status/personagens/personagem)
       └─ graphql/resolvers.js   fino, só delega pra store
            └─ data/personagensStore.js     seedSeNecessario() + listarPersonagens()/buscarPersonagemPorId()
                 ├─ data/personagensRepository.js   fonte crua: personagens.json (cache em memória)
                 └─ data/db.js                       conexão SQLite (better-sqlite3, WAL)
```

Request: Apollo recebe a query → resolver chama a store → store lê do SQLite
(já populado no boot via `seedSeNecessario`, idempotente) → resolver devolve o
objeto direto, sem transformação.

Nota: `personagensRepository.buscarPersonagemPorIdNaFonte(id)` existe mas não é
chamada em lugar nenhum — resíduo de uma versão anterior a mover a busca pro
SQLite. Não tem uso hoje.

## `web/` — camadas

```
main.jsx                 ApolloProvider > BrowserRouter > App
  └─ App.jsx              shell (Cabecalho, IconesNacao) + Routes com fade (AnimatePresence)
       ├─ pages/           ListaPersonagens, PersonagemDetalhe, MuralPrincipal, NaoEncontrada
       ├─ components/      Cabecalho, PersonagemCard, AvatarPersonagem, IconesNacao
       ├─ graphql/         client.js (ApolloClient + HttpLink), queries.js (PERSONAGENS_QUERY, PERSONAGEM_QUERY)
       └─ utils/           nacao.js (cor/ícone por nação), rotas.js (ROTA_MURAL, ROTA_PERSONAGENS, rotaPersonagem)
```

Rotas atuais: `/` → mural (landing), `/personagens` → listagem, `/personagens/:id`
→ detalhe, `/mural` → redirect pra `/` (compatibilidade com link antigo), `*` →
404.

Cada página mapeia `loading/error/data` do Apollo pra uma variável `estado`
(`'carregando' | 'erro' | 'conteudo'`, mais `'nao-encontrado'` no detalhe) —
padrão repetido em todas as páginas que consultam a API.

`MuralPrincipal` é majoritariamente conteúdo estático (arrays hard-coded de
nações/lugares/celebrações/datas); só a seção de destaque (`DestaquePersonagem`)
consulta a API de verdade (personagem fixo, id `5` = Zuko).

## Decisões e porquês

| Decisão | Status | Motivo |
|---|---|---|
| GraphQL único, sem REST | Explícito (projeto.md) | Equipe já tinha experiência prévia com a stack |
| Framer Motion (não React Spring) | Explícito (projeto.md deixava as duas opções em aberto) | — |
| Apollo Client + React Router | Explícito (projeto.md) | — |
| Dataset estático (`personagens.json`) em vez de API pública externa | Explícito (`api/data/README.md`) | Campos exigidos (`sonhos`) não existem em nenhuma fonte externa pronta |
| `better-sqlite3` como banco | Inferido | Dataset pequeno, driver síncrono simplifica o seed |
| Sem `Mutation` no schema | Inferido | Regra de ouro do projeto.md: back-end só busca/armazena/expõe |
| Vite como bundler | Inferido | Não mencionado no projeto.md, decisão de implementação |
| Oxlint (não ESLint) | Inferido | Mais rápido, troca cobertura de regras por velocidade de feedback no CI |
| Fallback de avatar via ui-avatars.com | Explícito (comentário em `utils/nacao.js`) | Nem todo personagem tem arte própria (só Aang e Katara têm `.jpg` real) |
| Dark mode automático (`prefers-color-scheme`, sem toggle) | Inferido | Simplicidade, escopo pequeno |
| Mural como landing page (`/`) em vez de `/personagens` | Decisão de produto recente, sem registro de motivo de negócio em nenhum lugar | Pedido direto durante a sessão de trabalho |

## Divergências conhecidas entre spec (`projeto.md`) e prática

- **Branch/PR**: o projeto.md prescreve `feature/*`/`fix/*` + PR pra `develop`;
  parte do histórico recente foi commitado direto em `main`. A partir de agora
  (ver `CLAUDE.md`) o fluxo documentado volta a ser seguido.
- **Versão de Node**: CI do `web` fixa Node 20; CI do `api` e o ambiente local
  usam Node 22. Nenhum `package.json` trava isso via `engines`.
- **Linter assimétrico**: `api/` não tem nenhum linter configurado; `web/` tem
  `oxlint` com regras enxutas (só `react/rules-of-hooks` e
  `react/only-export-components` — não cobre a11y, import ordering ou estilo).
