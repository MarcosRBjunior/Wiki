# Test Plan — Fotos reais dos personagens

Validado por uma sessão separada de QA, sem contexto da implementação. UI via
navegador real (Claude in Chrome), backend via request real contra o
servidor GraphQL rodando — nunca CLI, request direto sem servidor real ou
script mockado. Cada item marcado só com prova anexada.

- [x] **Listagem mostra fotos reais**: acessar `/personagens` e conferir que
      os personagens cujo nome de arquivo não batia com o nome do dataset
      (Ty Lee, Combustion Man, Jeong Jeong) e mais alguns outros (ex: Aang,
      Zuko, Toph) mostram a foto real, não o avatar gerado (cores sólidas
      com iniciais) nem o círculo de iniciais.
- [x] **Detalhe mostra foto real**: abrir `/personagens/:id` de um
      personagem qualquer e confirmar a mesma foto real, no tamanho maior
      do avatar de detalhe.
- [x] **Mural mostra foto real do destaque**: acessar a landing page (`/`)
      e confirmar que o card de destaque (Zuko) mostra a foto real.
- [x] **API expõe o campo `imagem` correto**: com o servidor GraphQL
      rodando, request real (`personagens { id nome imagem }`) e conferir
      que os 24 registros retornam um caminho `.jpeg` existente em
      `web/public/personagens/`, incluindo os 3 nomes corrigidos.
- [ ] **Fallback continua funcionando**: forçar um erro de carregamento de
      imagem (ex: via devtools, bloquear a request de uma foto) e confirmar
      que cai pro avatar gerado (ui-avatars.com) e depois pras iniciais, sem
      quebrar o layout.
- [x] **Sem regressão no restante da página**: navegação, cards e layout da
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

### Sessão de retomada (2026-09-13) — plugin Claude in Chrome reconectado

Nova sessão de QA, sem contexto da implementação, retomando os 5 itens de UI
com o navegador conectado. API (4000) e Web (5173) já rodando. Prova via
navegador real (Claude in Chrome), inspecionando `<img>.src`/`naturalWidth`
no DOM, requests HTTP reais e screenshots.

#### Listagem mostra fotos reais — PASSOU

Naveguei para `http://localhost:5173/personagens`. Via `javascript_tool`
(`document.querySelectorAll('img')`), os 24 cards retornaram `<img>` com
`src` em `http://localhost:5173/personagens/<arquivo>.jpeg`, todos com
`complete:true` e `naturalWidth > 0` (ex.: Aang 408px, Combustion Man 738px,
Jeong Jeong 332px, Ty Lee 359px, Toph Beifong 359px, Zuko 359px) — nenhum
`src` apontando para `ui-avatars.com`. Confirmado também via `fetch()` real
no console da página que os arquivos respondem `200 image/jpeg`:
`ty_lee.jpeg` (8957 bytes), `combustion.jpeg` (27884 bytes), `jeong.jpeg`
(12374 bytes), `aang.jpeg` (19649 bytes), `zuko.jpeg` (9955 bytes),
`toph.jpeg` (11469 bytes). Screenshots da grade completa (rolando a página)
mostram os 24 personagens com fotos reais e distintas, incluindo os 3 casos
corrigidos (Ty Lee, Combustion Man, Jeong Jeong).

#### Detalhe mostra foto real — PASSOU

Naveguei direto para `http://localhost:5173/personagens/11` (Ty Lee). O
`<img class="personagem-detalhe__avatar">` tem `src` =
`.../personagens/ty_lee.jpeg`, `naturalWidth`/`naturalHeight` = 359x270,
`complete:true`. Screenshot confirma a foto real de Ty Lee no avatar grande
da página de detalhe (não o avatar gerado nem iniciais).

#### Mural mostra foto real do destaque — PASSOU

Naveguei para `http://localhost:5173/`. O card "Conteúdo em destaque" mostra
Zuko com `<img class="mural__destaque-avatar">`, `src` =
`.../personagens/zuko.jpeg`, `naturalWidth`/`naturalHeight` = 359x270,
`complete:true`. Screenshot confirma a foto real de Zuko no mural.

#### Fallback continua funcionando — FALHA PARCIAL (bug real encontrado, não corrigido)

Testado via DOM: reescrevi `img.src` de um personagem para um caminho
inexistente (`/personagens/nao-existe.jpeg`) e observei o comportamento em
3 lugares (mural, listagem, detalhe), com polling do estado a cada
40-60ms:

- **1º nível (foto real → avatar gerado)**: funciona nos 3 lugares. Ao
  falhar o load da foto real, o componente troca para
  `<img src="https://ui-avatars.com/api/...">`, que carrega com sucesso
  (`naturalWidth: 256`, `complete:true`) e permanece exibido. Confirmado
  também que `ui-avatars.com` está acessível a partir do navegador de teste
  (`fetch` e `new Image()` diretos carregam normalmente).
- **2º nível (avatar gerado → iniciais)**: forcei um segundo erro (`src`
  do avatar gerado apontando para um host inválido). Nos 3 lugares o
  componente cai corretamente para a `<div>` de iniciais (ex.: "A" para
  Aang, "T" para Ty Lee, "Z" para Zuko), sem quebrar a árvore DOM.
  - Na **listagem** (`.personagem-card__avatar`) e no **detalhe**
    (`.personagem-detalhe__avatar`): a letra fica corretamente centralizada
    dentro do círculo dourado/colorido — confirmado por zoom de screenshot.
  - No **mural** (`.mural__destaque-avatar`): a letra ("Z") aparece solta
    no canto superior esquerdo do círculo, fora do centro, em vez de
    centralizada — confirmado por zoom de screenshot. Causa raiz
    identificada em `web/src/index.css`: a classe `.mural__destaque-avatar`
    (linha ~766) só define `width/height/border-radius/border/box-shadow/
    object-fit`, sem `display:flex; align-items:center;
    justify-content:center` nem background, ao contrário de
    `.personagem-card__avatar` (linha ~456) e `.personagem-detalhe__avatar`
    (linha ~573), que têm essas regras. Isso é pré-existente em
    `AvatarPersonagem.jsx`/`index.css` (não alterados pela tarefa 19) e só
    fica visível quando as DUAS camadas de fallback falham ao mesmo tempo —
    cenário que antes da tarefa 19 nunca era exercitado no mural com dados
    reais, mas que agora é um caminho de código real e coberto pelo item de
    teste "sem quebrar o layout".

  **Reprodução**: em `http://localhost:5173/` (mural), via console/DOM,
  forçar erro na foto do destaque e depois forçar erro no avatar gerado
  resultante (ex.: `document.querySelector('img.mural__destaque-avatar').src = '/x.jpeg'`,
  aguardar, depois setar o novo `src` do `<img>` de `ui-avatars.com` para um
  host inválido) — a `<div class="mural__destaque-avatar">` final mostra a
  inicial sem centralização, encostada no canto superior esquerdo do
  círculo.

  Por ter encontrado um bug real de layout, este item **não foi marcado**
  como passou — fica como falha parcial para o time de implementação
  corrigir a CSS de `.mural__destaque-avatar` (adicionar
  `display:flex; align-items:center; justify-content:center` e,
  idealmente, o mesmo tratamento visual de fundo/cor usado nas outras duas
  classes de avatar).

#### Sem regressão no restante da página — PASSOU

Screenshots da listagem completa (topo e rolada até o fim, 24 cards),
detalhe e mural mostram avatares circulares intactos, sem overflow, sem
imagem esticada ou cortada de forma incorreta, cards alinhados em grade
normalmente, navegação (Personagens/Mural/filtros por nação) com aparência
normal. A única anomalia visual encontrada foi a já registrada no item de
Fallback (2º nível, exclusivo do mural), que é sobre o estado de fallback
em si, não sobre a página com fotos reais.

### Resumo final

- Passou com prova real: **5/6** (Listagem, Detalhe, Mural, API, Sem
  regressão).
- Falha parcial, bug real encontrado e não corrigido por esta sessão de QA:
  **1/6** (Fallback — 1º nível ok em todo lugar; 2º nível com bug de CSS
  isolado ao mural, ver detalhes acima).
- Nenhum item ficou bloqueado nesta sessão; o plugin Claude in Chrome
  funcionou normalmente após a reconexão.
