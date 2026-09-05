# Aprendizados — 2026-09-04

## Processo

- O `develop` estava 12 commits atrás de `main` — todo o trabalho recente
  tinha ido direto pra `main`, pulando o fluxo de `develop`/PR descrito no
  `projeto.md`. Corrigido com fast-forward de `develop` até `main`; a partir
  de agora toda tarefa nova sai de uma branch própria (`feature/*`/`fix/*`)
  com PR pra `develop`.
- O board de tasks do `projeto.md` (Níveis 1-3, itens 1-14) já estava 100%
  implementado — não tinha nada "pendente" nele. Tarefas novas que não
  existiam no board original (como o mural, e agora o toggle de tema)
  precisam de numeração própria, sequencial ao board existente (usamos `15`
  pro toggle de tema).
- O ciclo requisitos → test plan → implementação → QA independente com
  navegador real funcionou de ponta a ponta na primeira tentativa, sem
  travar, para uma feature pequena e bem definida (toggle de tema). Prova de
  conceito do processo end-to-end.
- A automação de navegador usada pra QA depende de uma extensão conectada no
  Chrome; ela estava desconectada no início desta sessão e precisou ser
  verificada/reconectada antes de dar pra confiar nela pra validar itens do
  test plan. Vale checar a conexão no começo de cada sessão que for depender
  de QA visual.

## Débito técnico conhecido (não resolvido nesta sessão)

- `api/` não tem nenhum linter configurado (assimetria com o `oxlint` do
  `web/`).
- `api/data/personagensRepository.js` exporta
  `buscarPersonagemPorIdNaFonte(id)`, sem nenhum uso no projeto — candidato a
  remoção.
- CI do `web/` fixa Node 20; ambiente local e CI do `api/` usam Node 22 —
  nenhum `package.json` trava isso via `engines`.
- Cobertura de teste com lacunas conhecidas: `api/` não testa a query
  `status` nem a camada `data/` isolada; `web/` não testa
  `utils/nacao.js`/`utils/rotas.js` isolados, o estado de erro de GraphQL, o
  filtro por nação, o toggle de seções do detalhe, o fallback de
  `AvatarPersonagem`, nem o conteúdo estático do mural.

## Decisões registradas

- Mensagens de commit: inglês, Conventional Commits (os primeiros commits do
  projeto eram em português; padronizado em inglês daqui pra frente).
- Toggle de tema claro/escuro: escolha manual do usuário tem prioridade sobre
  `prefers-color-scheme`; sem escolha manual, o comportamento automático por
  SO é preservado.
