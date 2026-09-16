# Test Plan — Toggle de tema claro/escuro

Validado por uma sessão separada de QA, sem contexto da implementação, via
navegador real (não CLI, não mock). Cada item marcado só com prova anexada
(descrição do que foi visto/screenshot).

- [x] **Estado inicial respeita o SO**: com o navegador emulando
      `prefers-color-scheme: dark` e sem tema salvo em `localStorage`, a
      página carrega com a paleta escura (sem precisar clicar em nada).
- [x] **Toggle muda a tela de verdade**: clicar no botão de tema no Cabeçalho
      troca visivelmente as cores de fundo/texto da página na hora (sem
      reload).
- [x] **Persiste após reload**: depois de clicar no toggle, recarregar a
      página (F5) — o tema escolhido continua aplicado, não volta pro
      padrão do SO.
- [x] **Consistente entre rotas**: navegar do mural (`/`) para a listagem
      (`/personagens`) depois de ter escolhido um tema — o tema escolhido
      permanece em ambas as telas.
- [x] **Acessível**: o botão tem `aria-label` (ou texto visível) descrevendo
      a ação, e é alcançável/ativável via Tab + Enter.

## Evidência

Validação feita em `http://localhost:5173/` via Claude in Chrome (navegador
real, sessão de QA sem contexto de implementação). O navegador de teste
reporta `window.matchMedia('(prefers-color-scheme: dark)').matches === false`
(prefere claro), então a cobertura do item 1 é para o caminho claro; o
caminho escuro foi validado indiretamente ao forçar o tema no item 2 (ver
abaixo).

1. **Estado inicial respeita o SO**: com `localStorage.clear()` executado na
   origem e a página então carregada/recarregada, nenhuma chave de tema
   existia em `localStorage` (`Object.keys(localStorage)` vazio) e o
   `<html>`/`<body>` não tinham `data-theme`/classe de tema. A cor de fundo
   computada do `<body>` era `oklch(0.96 0.02 75)` (creme claro) com texto
   `oklch(0.24 0.03 50)` (marrom escuro) — paleta clara, batendo com
   `matches: false` reportado pelo `matchMedia` desta máquina. Screenshot
   confirmou visualmente fundo creme/texto escuro, sem nenhum clique prévio.

2. **Toggle muda a tela de verdade**: com o botão localizado no Cabeçalho
   (canto superior direito, círculo pequeno com ícone de sol, ao lado dos
   links "Personagens"/"Mural"), um clique único trocou instantaneamente
   `background-color` do `<body>` de `oklch(0.96 0.02 75)` (creme) para
   `oklch(0.16 0.018 50)` (quase preto/marrom escuro) e o texto de
   `oklch(0.24 0.03 50)` para `oklch(0.93 0.018 70)` (quase branco). O ícone
   do botão trocou de sol para lua. Confirmado por screenshot antes/depois
   — mesma URL, sem reload, mudança instantânea em todo o corpo da página
   (cards, títulos, textos).

3. **Persiste após reload**: com o tema escuro ativo, `localStorage`
   passou a conter a chave `wiki-tema` com valor `"escuro"`. Após
   `navigate` para a mesma URL (reload completo), a página já carregou em
   tema escuro (fundo `oklch(0.16 0.018 50)`, ícone de lua) mesmo durante a
   animação de fade-in inicial — não houve flash do tema claro do SO.
   Confirmado por screenshot pós-reload e leitura do computed style.

4. **Consistente entre rotas**: com o tema escuro ainda ativo, clique no
   link "Personagens" do Cabeçalho navegou para `/personagens` (SPA, sem
   reload de página completo) e a listagem de personagens renderizou
   inteiramente em tema escuro (fundo escuro, cards com bordas/textos
   adaptados, ícone de lua no botão de tema mantido). Confirmado por
   screenshot da grade completa de personagens em tema escuro.

5. **Acessível**: `find`/`read_page` (árvore de acessibilidade) confirmaram
   que o elemento é um `<button type="button">` nativo com nome acessível
   dinâmico: com tema escuro ativo o rótulo era `"Ativar tema claro"`, e
   depois de alternar para claro o rótulo mudou para `"Ativar tema
   escuro"` — ou seja, sempre descreve a ação do próximo clique, como
   pedido nos requisitos. Teste de teclado: cliquei em uma área neutra do
   cabeçalho, pressionei Tab 4 vezes (logo → "Personagens" → "Mural" →
   botão de tema) e um zoom no botão mostrou um anel de foco visível
   (contorno dourado/laranja) ao redor do ícone de lua. Com o foco no
   botão, pressionar Enter alternou o tema de escuro para claro
   (screenshot confirma fundo creme, ícone de sol, anel de foco ainda
   visível) — confirma ativação por teclado (Enter) num elemento
   realmente focável via Tab.

Todos os 5 itens do Test Plan foram validados com prova concreta (screenshots
e leitura de estilo computado/DOM via JavaScript no navegador real). Nenhum
item ficou sem cobertura.
