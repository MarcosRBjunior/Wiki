# Convenções

## Idioma

- Identificadores, classes CSS e textos de UI: **português (pt-BR)** nos dois
  lados (`api/` e `web/`). `web/index.html` declara `lang="pt-BR"`.
- Mensagens de commit: **inglês**, sempre em Conventional Commits
  (`feat(api): ...`, `fix(web): ...`). Os primeiros commits do projeto eram em
  português; a partir de um certo ponto o padrão virou inglês — manter inglês
  daqui pra frente, não misturar de novo.

## `api/`

- ESM puro (`"type": "module"`), sem exceção — nunca `require`/`module.exports`.
- Sem `try/catch` explícito em resolver ou camada de dados. Ausência (`id`
  inexistente) é tratada com `?? null`, aproveitando que o campo GraphQL é
  nullable — não lança erro, só devolve `null`.
- Sem linter configurado (gap conhecido — não é ausência de convenção, é
  ausência de ferramenta).
- Teste: `node --test` nativo (não Jest/Vitest), um arquivo por módulo testado,
  convenção `<modulo>.test.js` ao lado do código-fonte (não em pasta
  `tests/`). Testes batem no SQLite real (seed idempotente via `INSERT OR
  IGNORE`), não mockam o banco.

## `web/`

- Um componente nomeado exportado por arquivo: `export function X()`, arquivo
  `PascalCase.jsx` = nome do componente. Única exceção: `App.jsx` usa `export
  default` (é importado assim em `main.jsx` e `App.test.jsx`).
- `pages/` = telas roteadas; `components/` = peças reutilizáveis. Sem
  aninhamento por domínio, sem barrel/index.
- CSS: um único `src/index.css` global (sem CSS Modules/styled-components/
  Tailwind), convenção BEM-like (`bloco__elemento--modificador`), classes em
  português. Cor por nação via custom properties (`--cor-*`) aplicadas com
  `estiloNacaoVars()`.
- Rotas: **nunca** hardcode a string da rota — use as constantes de
  `utils/rotas.js` (`ROTA_MURAL`, `ROTA_PERSONAGENS`, `rotaPersonagem(id)`).
- Lint: `oxlint` (`.oxlintrc.json`), plugins `react` + `oxc`, regras
  explícitas só `react/rules-of-hooks` (error) e
  `react/only-export-components` (warn). Não cobre a11y, ordenação de import
  ou estilo — "lint limpo" aqui é sinal fraco, não garante muita coisa além de
  corretude de hooks.
- Teste: Vitest + Testing Library + `MockedProvider` (`@apollo/client/testing/react`).
  Os testes existentes são de integração via rota — renderizam `<App/>` inteiro
  dentro de `<MemoryRouter>`, não testam componente isolado. `test/setup.js`
  importa os matchers do `jest-dom` e faz stub de `IntersectionObserver`
  (jsdom não tem — necessário por causa do `whileInView` do Framer Motion no
  mural).

## Branch e commit

Regra completa está no `projeto.md`; resumo prático:

- Uma branch por tarefa: `feature/<numero>-<slug>` ou `fix/<numero>-<slug>`.
- PR sempre para `develop`, nunca direto pra `main`.
- Squash-merge, deletar a branch depois.
- `develop` → `main` só quando todas as tasks do nível estiverem fechadas.
- Commits pequenos, Conventional Commits, em inglês.
