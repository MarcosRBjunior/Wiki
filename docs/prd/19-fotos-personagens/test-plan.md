# Test Plan — Fotos reais dos personagens

Validado por uma sessão separada de QA, sem contexto da implementação. UI via
navegador real (Claude in Chrome), backend via request real contra o
servidor GraphQL rodando — nunca CLI, request direto sem servidor real ou
script mockado. Cada item marcado só com prova anexada.

- [ ] **Listagem mostra fotos reais**: acessar `/personagens` e conferir que
      os personagens cujo nome de arquivo não batia com o nome do dataset
      (Ty Lee, Combustion Man, Jeong Jeong) e mais alguns outros (ex: Aang,
      Zuko, Toph) mostram a foto real, não o avatar gerado (cores sólidas
      com iniciais) nem o círculo de iniciais.
- [ ] **Detalhe mostra foto real**: abrir `/personagens/:id` de um
      personagem qualquer e confirmar a mesma foto real, no tamanho maior
      do avatar de detalhe.
- [ ] **Mural mostra foto real do destaque**: acessar a landing page (`/`)
      e confirmar que o card de destaque (Zuko) mostra a foto real.
- [x] **API expõe o campo `imagem` correto**: com o servidor GraphQL
      rodando, request real (`personagens { id nome imagem }`) e conferir
      que os 24 registros retornam um caminho `.jpeg` existente em
      `web/public/personagens/`, incluindo os 3 nomes corrigidos.
- [ ] **Fallback continua funcionando**: forçar um erro de carregamento de
      imagem (ex: via devtools, bloquear a request de uma foto) e confirmar
      que cai pro avatar gerado (ui-avatars.com) e depois pras iniciais, sem
      quebrar o layout.
- [ ] **Sem regressão no restante da página**: navegação, cards e layout da
      listagem/detalhe/mural continuam funcionando normalmente com as fotos
      reais (nenhum overflow, imagem esticada ou quebrada).

## Evidência

_(preenchida pela sessão de validação, não pela implementação)_

Sessão de QA em 2026-09-13, branch `feature/19-fotos-personagens`, com API
(porta 4000) e Web (porta 5173) já rodando.

### Itens de UI (Listagem, Detalhe, Mural, Fallback, Sem regressão) — NÃO TESTADOS

O plugin Claude in Chrome não está conectado nesta sessão. Tentativas reais
feitas, nesta ordem:

1. `mcp__claude-in-chrome__tabs_context_mcp` (`createIfEmpty: true`) →
   erro: "Browser extension is not connected. Please ensure the Claude
   browser extension is installed and running (https://claude.ai/chrome)..."
2. `mcp__claude-in-chrome__list_connected_browsers` → retornou `[]` (nenhum
   navegador conectado à conta).
3. `mcp__claude-in-chrome__tabs_context_mcp` (`createIfEmpty: true`),
   segunda tentativa → mesmo erro de extensão não conectada.

Conforme a regra do projeto (prova real via navegador, nunca mock/CLI como
substituto para comportamento de UI), os 5 itens abaixo permanecem
`- [ ]` (não marcados) até a sessão de navegador ser reiniciada e a
validação ser retomada:

- Listagem mostra fotos reais (`/personagens`)
- Detalhe mostra foto real (`/personagens/:id`)
- Mural mostra foto real do destaque (`/`)
- Fallback continua funcionando (erro de carregamento força ui-avatars.com)
- Sem regressão no restante da página

**Ação necessária antes de retomar**: reconectar a extensão Claude in Chrome
(reinstalar/reiniciar o Chrome com a extensão, logado na mesma conta usada
pelo Claude Code) e repetir os 5 itens acima navegando de verdade em
`http://localhost:5173/`.

### API expõe o campo `imagem` correto — PASSOU

Request real contra o servidor GraphQL rodando em `http://localhost:4000/`:

```
curl -s -X POST http://localhost:4000/ \
  -H "Content-Type: application/json" \
  -d '{"query":"{ personagens { id nome imagem } }"}'
```

Resposta: 24 registros, todos com `imagem` no formato `/personagens/<arquivo>.jpeg`.
Confirmado por listagem de diretório (`ls web/public/personagens/`) que
todos os 24 arquivos `.jpeg` referenciados existem de fato nesse diretório
(24 arquivos no total, nenhum a mais nem a menos).

Os 3 casos de nome de arquivo divergente do nome do personagem, citados nos
requisitos, foram conferidos individualmente na resposta:

- `{"id":"11","nome":"Ty Lee","imagem":"/personagens/ty_lee.jpeg"}`
- `{"id":"23","nome":"Combustion Man","imagem":"/personagens/combustion.jpeg"}`
- `{"id":"24","nome":"Jeong Jeong","imagem":"/personagens/jeong.jpeg"}`

Todos os 3 batem com o esperado nos requisitos (`ty_lee.jpeg`,
`combustion.jpeg`, `jeong.jpeg`) e os arquivos existem em
`web/public/personagens/`.

Demais registros conferidos amostralmente (Aang → `aang.jpeg`, Zuko →
`zuko.jpeg`, Toph Beifong → `toph.jpeg`, Katara → `katara.jpeg`) também
corretos e com arquivo existente.

### Resumo

- Passou com prova real: **1/6** (API expõe o campo `imagem` correto).
- Não testado (bloqueado por plugin de navegador desconectado, não é
  falha da implementação): **5/6** (Listagem, Detalhe, Mural, Fallback,
  Sem regressão).
- Nenhuma falha real de implementação foi encontrada nos itens que puderam
  ser testados.
