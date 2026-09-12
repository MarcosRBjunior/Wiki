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
api/   Node 22, GraphQL-only via Apollo Server 5 — leitura (Query) + conta/sessão (Mutation, tarefa 16)
web/   React 19 + Vite 8 + Apollo Client 4 + React Router 7 + Framer Motion
```

## `api/` — camadas

```
index.js                        entrypoint: carrega .env, seed, sobe Apollo Server
  ├─ graphql/typeDefs.js         schema (Personagem, Usuario, Query, Mutation: criarConta/login)
  │    └─ graphql/resolvers.js   fino, só delega pra store
  │         ├─ data/personagensStore.js     seedSeNecessario() + listarPersonagens()/buscarPersonagemPorId()
  │         │    ├─ data/personagensRepository.js   fonte crua: personagens.json (cache em memória)
  │         │    └─ data/db.js                       conexão SQLite (better-sqlite3, WAL)
  │         └─ data/usuariosStore.js         criarUsuario()/buscarUsuarioPorEmail()/verificarSenha() (bcryptjs)
  └─ autenticacao.js             assinarToken()/verificarToken() (JWT) — usado no `context` do Apollo pra
                                  popular `usuarioId` a partir do header `Authorization`
```

Request: Apollo recebe a query → resolver chama a store → store lê do SQLite
(já populado no boot via `seedSeNecessario`, idempotente) → resolver devolve o
objeto direto, sem transformação. Em `criarConta`/`login`, o resolver assina um
JWT (`autenticacao.js`) e devolve `{ token, usuario }`; requests seguintes
mandam esse token no header `Authorization: Bearer <token>`, decodificado na
função `context` do `startStandaloneServer` (`index.js`).

Nota: `personagensRepository.buscarPersonagemPorIdNaFonte(id)` existe mas não é
chamada em lugar nenhum — resíduo de uma versão anterior a mover a busca pro
SQLite. Não tem uso hoje.

## `web/` — camadas

```
main.jsx                 ApolloProvider > BrowserRouter > App
  └─ App.jsx              ProvedorAutenticacao > shell (Cabecalho, IconesNacao) + Routes com fade (AnimatePresence)
       ├─ pages/           ListaPersonagens, PersonagemDetalhe, MuralPrincipal, PaginaLogin, PaginaCadastro, NaoEncontrada
       ├─ components/      Cabecalho, PersonagemCard, AvatarPersonagem, IconesNacao, ProvedorAutenticacao
       ├─ graphql/         client.js (ApolloClient + HttpLink + link de auth), queries.js (queries e mutations)
       └─ utils/           nacao.js (cor/ícone por nação), rotas.js (rotas), tema.js (`useTema`), autenticacao.js
                            (contexto + `useAutenticacao`, sessão em `localStorage`)
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
| `Mutation` no schema (`criarConta`, `login`) | Decisão de produto (tarefa 16, `docs/prd/16-cadastro-login/`) | Favoritar personagens (tarefa 17) exige conta de usuário; a regra "só busca/armazena/expõe" valia enquanto não havia motivo pra escrever dado nenhum |
| Sessão via JWT no header (`Authorization: Bearer`), não cookie | Decisão de produto (tarefa 16) | `startStandaloneServer` não dá suporte a cookie sem trocar pra `expressMiddleware`; JWT em `localStorage` é mais simples, mas fica mais exposto a XSS que um cookie `httpOnly` — aceitável pro escopo solo/hobby do projeto |
| `bcryptjs` (não `bcrypt`) pra hash de senha | Decisão de produto (tarefa 16) | Sem etapa de build nativo, mais previsível que `bcrypt` pro escopo do projeto |
| `JWT_SECRET` obrigatório, sem fallback fixo no código (`api/autenticacao.js` lança erro na inicialização se faltar) | Decisão de produto (tarefa 16, revisão de segurança pós-implementação) | Um fallback hardcoded assinaria tokens válidos com um segredo público conhecido por qualquer um que leia o repo; `npm test` define seu próprio segredo de teste (`api/package.json`) pra não depender do `.env` local |
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
