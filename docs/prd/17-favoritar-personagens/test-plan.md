# Test Plan — Favoritar personagens

Validado por uma sessão separada de QA, sem contexto da implementação. UI via
navegador real (Claude in Chrome), backend via request real contra o servidor
GraphQL rodando — nunca CLI, request direto sem servidor real ou script
mockado. Cada item marcado só com prova anexada.

- [ ] **Favoritar muda o ícone na hora**: logado, na página de detalhe de um
      personagem, clicar no botão de favoritar; confirmar que o ícone muda
      (vazio → cheio) sem reload.
- [x] **Favorito persiste no banco**: depois de favoritar, inspecionar a
      tabela `favoritos` no SQLite e confirmar a linha `(usuario_id,
      personagem_id)` correspondente.
- [x] **Desfavoritar reverte**: clicar de novo no botão; ícone volta ao
      estado vazio e a linha correspondente some/é marcada como removida no
      banco.
- [x] **Persiste entre reloads**: favoritar, dar F5 na página de detalhe;
      confirmar que o ícone continua no estado "favoritado".
- [x] **Sem login, botão não aparece (ou aparece bloqueado)**: acessar a
      mesma página de detalhe deslogado; confirmar o comportamento decidido
      na implementação pra esse caso.
- [x] **Página "Meus favoritos" lista o que foi favoritado**: acessar
      `/favoritos` logado e confirmar que os personagens favoritados
      aparecem, com os mesmos cards da listagem principal.
- [x] **`/favoritos` sem login**: acessar a rota deslogado e confirmar
      redirecionamento pra `/login` (ou mensagem clara, conforme decidido).
- [x] **Isolamento entre contas**: favoritar um personagem com a conta A,
      logar com a conta B e confirmar que esse personagem NÃO aparece como
      favorito pra B.
- [ ] **Acessível por teclado**: alcançar e ativar o botão de favoritar só
      com Tab + Enter/Espaço, e confirmar `aria-label` descrevendo a ação do
      próximo clique.

## Evidência

_(preenchida pela sessão de validação, não pela implementação)_

Sessão de QA em 2026-09-14/15, branch `feature/17-favoritar-personagens`,
sem contexto da implementação, com API (porta 4000) e Web (porta 5173) já
rodando. Confirmado no início:

```
curl -s -X POST http://localhost:4000/ -H "Content-Type: application/json" -d '{"query":"{ __typename }"}'
→ {"data":{"__typename":"Query"}}
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/
→ 200
```

Plugin Claude in Chrome conectado normalmente (`tabs_context_mcp` retornou
uma aba válida de primeira). Contas de teste criadas do zero via `/cadastro`
no navegador (não reaproveitei o usuário `smoke-...@teste.com` que já
existia no banco de uma sessão anterior):

- Conta A: `qa17-conta-a@teste.com` / `SenhaTeste123`
- Conta B: `qa17-conta-b@teste.com` / `SenhaTeste123`

Inspeção do banco (`sqlite3 api/data/personagens.db`) confirma o schema:

```sql
CREATE TABLE favoritos (
    usuario_id TEXT NOT NULL REFERENCES usuarios(id),
    personagem_id TEXT NOT NULL REFERENCES personagens(id),
    PRIMARY KEY (usuario_id, personagem_id)
);
CREATE TABLE usuarios (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    criado_em TEXT NOT NULL
);
```

### Favoritar muda o ícone na hora — FALHA PARCIAL (bug real encontrado, não corrigido)

Logado como Conta A em `/personagens/1` (Aang), com o coração vazio
confirmado por zoom de screenshot (contorno, sem preenchimento) e
`aria-label="Adicionar aos favoritos"` (via `find`). Cliquei no botão
(`mcp__claude-in-chrome__computer` `left_click` real sobre o elemento).

Resultado funcional: correto e imediato, sem reload —

- `aria-label` muda instantaneamente para `"Remover dos favoritos"`
  (confirmado via `find` logo após o clique).
- Request real disparado para `http://localhost:4000/` (`POST`, status 200)
  confirmado em `read_network_requests`.
- Linha `(6284118c-…, 1)` aparece na tabela `favoritos` no SQLite
  imediatamente (sem precisar de reload).

Resultado visual: **quebrado**. Zoom de screenshot na região do botão logo
após o clique mostra um círculo vermelho sólido, sem nenhum coração visível
— não um "coração cheio", só uma bolinha vermelha. Testei se era só uma
animação em andamento (esperei 2s e depois 3s adicionais) e o círculo sem
coração persistiu — não é transitório.

**Causa raiz identificada** (só investigada depois de já ter reproduzido o
bug pela UI, lendo `web/src/index.css` e `web/src/components/BotaoFavoritar.jsx`):

- `web/src/index.css:584` — `.botao-favoritar:hover { color: var(--cor-fogo); border-color: var(--cor-fogo); }`
- `web/src/index.css:594` — `.botao-favoritar--ativo { color: #fff; background: var(--cor-fogo); border-color: var(--cor-fogo); }`
- `web/src/index.css:600` — `.botao-favoritar--ativo svg { fill: currentColor; }`

Especificidade CSS: `.botao-favoritar:hover` tem especificidade (0,2,0)
(uma classe + um pseudo-classe), maior que `.botao-favoritar--ativo`
(0,1,0, uma classe só) — e a regra de `:hover` também vem depois no arquivo.
Como o clique do usuário deixa o mouse fisicamente em cima do botão (é o
gesto natural — clicar e olhar o resultado sem mover o mouse), o estado
`:hover` continua ativo no momento em que o React aplica a classe
`--ativo`. A regra `:hover` vence e sobrescreve `color: #fff` (branco) por
`color: var(--cor-fogo)` (o mesmo vermelho do `background`). Como o SVG usa
`fill: currentColor`, o coração fica exatamente da cor do fundo —
invisível. Sobra só o círculo vermelho.

Confirmado via `javascript_tool`:

```js
document.querySelector('button[aria-label="Remover dos favoritos"]').matches(':hover')
→ true
```

E a prova definitiva: mover o mouse pra longe do botão (`hover` em
`(200, 500)`), **sem reload nenhum**, faz o coração branco aparecer
corretamente sobre o fundo vermelho na hora (zoom de screenshot antes/depois
comparados). Depois de um F5 completo (mouse não está mais sobre o botão) o
estado favoritado também sempre renderiza certo (branco sobre vermelho) —
por isso o item "Persiste entre reloads" abaixo passa sem ressalvas: o bug é
só no instante do clique com o mouse ainda em cima do botão, não em geral.

O caminho inverso (desfavoritar: cheio → vazio) **não** tem esse problema —
testado e confirmado visualmente correto mesmo com o mouse ainda sobre o
botão logo após o clique, porque no estado não-favoritado o fundo é claro
(`var(--cor-superficie)`) e o hover só troca a cor do contorno pra vermelho,
o que ainda deixa o coração bem visível (contorno vermelho sobre fundo
claro). Por isso o item "Desfavoritar reverte" abaixo passa integralmente.

**Reprodução**: logado, abrir `/personagens/:id` de um personagem não
favoritado, clicar no botão de favoritar sem mover o mouse depois — o
círculo fica vermelho sólido, sem coração visível, até o mouse sair de cima
do botão ou a página recarregar.

**Sugestão pro time de implementação** (não fiz a correção): inverter a
ordem das regras no CSS ou aumentar a especificidade de
`.botao-favoritar--ativo:hover` com uma regra própria que force `color: #fff`
também no hover do estado ativo.

Por ter encontrado um bug visual real e reproduzível, este item **não foi
marcado** como passou — o estado interno muda corretamente e na hora (aria-label,
classe, banco), mas o retorno visual imediato ("ícone muda pra cheio") fica
quebrado no gesto de interação mais comum (clicar e não mover o mouse).

### Favorito persiste no banco — PASSOU

Depois do clique acima, consulta real:

```
sqlite3 api/data/personagens.db "SELECT * FROM favoritos;"
→ 6284118c-fad4-4d9e-9990-e21fe6243cff|1
```

`6284118c-fad4-4d9e-9990-e21fe6243cff` é o id da Conta A
(`qa17-conta-a@teste.com`) e `1` é o id do Aang — confirmado cruzando com
`SELECT id, email FROM usuarios;`.

### Desfavoritar reverte — PASSOU

Cliquei de novo no mesmo botão (Aang, Conta A). Confirmado:

- Zoom de screenshot imediatamente após o clique mostra o coração de volta
  ao contorno vazio, sem o bug de contraste do item anterior (ver
  explicação acima — o hover nesse sentido não causa o mesmo problema).
- `aria-label` volta para `"Adicionar aos favoritos"` (via `find`).
- `sqlite3 api/data/personagens.db "SELECT * FROM favoritos;"` volta a
  retornar vazio (0 linhas) — a linha foi removida de verdade, não só
  marcada.

### Persiste entre reloads — PASSOU

Favoritei Aang de novo (Conta A) e recarreguei a página
(`navigate` para a mesma URL, equivalente a F5). Depois do carregamento
completo (a página passa por um estado `Carregando personagem...` de ~1-2s
antes de renderizar — esperei esse tempo antes de conferir), o botão mostra
coração branco preenchido corretamente sobre fundo vermelho (zoom de
screenshot) e `aria-label="Remover dos favoritos"` (via `find`) — o estado
buscado do servidor após reload bate com o banco (`SELECT * FROM favoritos`
segue mostrando a linha `(…, 1)`).

### Sem login, botão não aparece — PASSOU

Cliquei em "Sair" (logout real pelo botão do cabeçalho) e acessei
`/personagens/1` deslogado. O cabeçalho mostra "Entrar" / "Criar conta" (sem
e-mail, sem "Sair"), confirmando o logout. O botão de favoritar não aparece
— nem vazio nem desabilitado: o espaço que ele ocupava no card simplesmente
não é renderizado. Confirmado por screenshot completo e por
`find("botão de favoritar (ícone de coração)")`, que retornou explicitamente
que **não existe** nenhum botão com essa função na árvore de acessibilidade
da página nesse estado.

### Página "Meus favoritos" lista o que foi favoritado — PASSOU

Logado como Conta A (com Aang favoritado), acessei `/favoritos`. A página
mostra exatamente um card: Aang, com o mesmo layout da listagem principal
(ícone, nome, tag de nação "Nômades do Ar"). Confirmado via
`javascript_tool` que o elemento do card usa a classe `personagem-card`
— a mesma classe usada em `/personagens` — comprovando reaproveitamento do
componente, não uma lista visualmente diferente.

### `/favoritos` sem login — PASSOU

Deslogado, `navigate` direto para `http://localhost:5173/favoritos`.
A URL final no navegador vira `http://localhost:5173/login` (redirecionamento
real, confirmado pelo `tabId` context após a navegação) e a tela mostra o
formulário "Entrar" — não uma tela vazia nem erro.

### Isolamento entre contas — PASSOU

Testado nos dois sentidos:

1. Aang favoritado pela Conta A (ver itens acima). Logout de A, cadastro e
   login da Conta B (`qa17-conta-b@teste.com`, criada do zero por
   `/cadastro`). Acessei `/personagens/1` como Conta B: coração aparece
   **vazio** (contorno, não preenchido) e `aria-label="Adicionar aos
   favoritos"` (via `find`) — Aang não está favoritado para B. `/favoritos`
   como Conta B mostra a mensagem "Você ainda não favoritou nenhum
   personagem." (screenshot).
2. Inverti: favoritei Katara (id `2`) com a Conta B
   (`sqlite3 ... "SELECT * FROM favoritos"` →
   `a2080242-…|2` junto da linha antiga `6284118c-…|1`, confirmando que a
   ação de B não mexeu na linha de A). Logout de B, login de volta como
   Conta A, acessei `/favoritos`: a página continua mostrando **só Aang**,
   Katara não aparece — confirmando isolamento nos dois sentidos, não só
   "A não vê o que B favoritou" mas também "B favoritar não contamina a
   lista de A".

IDs de usuário confirmados via banco:
`6284118c-fad4-4d9e-9990-e21fe6243cff` = `qa17-conta-a@teste.com`,
`a2080242-7efe-4b8d-878b-6daa7d52b450` = `qa17-conta-b@teste.com`.

### Acessível por teclado — NÃO CONCLUÍDO (evidência parcial + limitação da ferramenta de automação)

Consegui comprovar com prova real, via navegador:

- **O botão é um elemento nativo focável por teclado**: `<button type="button">`
  (não uma `<div>` com `onClick`), com `tabIndex: 0` e `disabled: false`
  confirmado via `javascript_tool` (`btn.tabIndex`, `btn.disabled`) — ou
  seja, por semântica HTML padrão ele entra na ordem de tabulação natural da
  página sem precisar de nenhum atributo extra.
- **Ativação por Enter funciona de verdade**: com o foco real do DOM no
  botão (`document.activeElement === btn`, confirmado via
  `javascript_tool`), disparei a tecla `Return` pelo `computer` tool (evento
  de teclado real do Chrome, não simulação via JS). Um listener de
  `keydown` em captura no `window` registrou o evento chegando
  genuinamente no botão (`{"key":"Enter","target":"BUTTON","targetLabel":"Adicionar aos favoritos"}`).
  O clique foi processado de verdade: `aria-label` mudou para `"Remover dos
  favoritos"` e a linha `(6284118c-…, 2)` (Conta A, Katara) apareceu na
  tabela `favoritos` do SQLite.
- **Ativação por Espaço também funciona**: mesmo teste com a tecla `space`
  — evento `{"key":" ","target":"BUTTON",...}` capturado, `aria-label`
  voltou para `"Adicionar aos favoritos"` e a linha correspondente foi
  removida do banco.
- **`aria-label` descreve corretamente a próxima ação** em todos os
  estados testados ao longo desta sessão: `"Adicionar aos favoritos"`
  quando vazio, `"Remover dos favoritos"` quando favoritado — confirmado
  repetidas vezes em personagens e contas diferentes.

O que **não** consegui comprovar com prova real: alcançar o botão navegando
só com a tecla Tab a partir do topo da página, como o item pede
literalmente ("alcançar... só com Tab"). Nesta sessão, a tecla Tab entregue
pelo `computer` tool (`key`, `text: "Tab"`, inclusive com `repeat: 5`) não
moveu o foco real da página em nenhuma tentativa — `document.activeElement`
permaneceu `BODY` antes e depois, mesmo com `document.hasFocus()` retornando
`true`. Investigando mais a fundo (não é suposição sobre a implementação,
é diagnóstico da própria ferramenta de automação): anexei um listener de
`keydown` em captura no `window` e, com o foco em `BODY` (nada focado
explicitamente), **nenhum evento de tecla chegava à página** — nem Tab, nem
uma letra qualquer (`"a"`). Também percebi que um `left_click` real do
`computer` tool sobre um link (`<a>`) ou sobre o próprio botão de favoritar
não deixava `document.activeElement` apontar pra esse elemento (ficava em
`BODY`), embora o clique funcionasse de verdade no sentido de disparar o
`onClick` (a mutação era enviada, o estado mudava). Ou seja: cliques e
teclas físicas funcionam para acionar elementos, mas esta sessão do plugin
não está deixando o foco do DOM (`document.activeElement`) refletir essas
interações — parece uma característica de como o Claude in Chrome despacha
esses eventos aqui, não um bug da aplicação (confirmei que o elemento é
focável de verdade: `btn.focus()` funciona e `document.activeElement` passa
a ser o botão corretamente).

Para conseguir testar a ativação por teclado (Enter/Espaço) sem travar a
sessão, usei `btn.focus()` — um método padrão do DOM, não um mock do clique
em si — só para colocar o foco real no elemento, e a partir daí usei o
`computer` tool para mandar a tecla de verdade. Isso comprova a metade
"ativar com Enter/Espaço uma vez focado" com prova real de teclado, mas não
comprova literalmente a metade "alcançar com Tab a partir do topo da
página", que é o que o item pede. Por isso o item fica **sem marcar**.

Não é um caso de "plugin desconectado" (a regra 3) — o plugin está
conectado e funcional para navegação, cliques e digitação em formulários
durante toda a sessão — é uma limitação mais específica só no rastreamento
de foco/Tab que não consegui contornar com prova real de teclado pura.
**Ação sugerida pra retomar**: repetir este item específico em uma sessão
nova do Claude in Chrome (reiniciar a extensão), testando se uma tecla Tab
pura, a partir do carregamento da página, move
`document.activeElement` como esperado; se sim, seguir a cadeia de Tabs até
o botão de favoritar e then confirmar Enter/Espaço + `aria-label` como já
feito aqui.

### Resumo final

- Passou com prova real: **7/9** (Favorito persiste no banco, Desfavoritar
  reverte, Persiste entre reloads, Sem login botão não aparece, Página
  "Meus favoritos", `/favoritos` sem login, Isolamento entre contas).
- Falha parcial, bug real encontrado e não corrigido por esta sessão de QA:
  **1/9** (Favoritar muda o ícone na hora — estado interno correto e
  instantâneo, mas o coração fica visualmente invisível/vermelho-sobre-vermelho
  no instante do clique por causa de um bug de especificidade CSS entre
  `.botao-favoritar:hover` e `.botao-favoritar--ativo` em
  `web/src/index.css`, detalhado acima com causa raiz e reprodução).
- Não concluído por limitação da ferramenta de automação, não da aplicação:
  **1/9** (Acessível por teclado — ativação por Enter/Espaço e `aria-label`
  comprovados com teclado real; alcance via Tab puro não pôde ser
  comprovado nesta sessão do plugin Claude in Chrome).
