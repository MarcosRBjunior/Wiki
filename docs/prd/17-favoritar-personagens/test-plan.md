# Test Plan — Favoritar personagens

Validado por uma sessão separada de QA, sem contexto da implementação. UI via
navegador real (Claude in Chrome), backend via request real contra o servidor
GraphQL rodando — nunca CLI, request direto sem servidor real ou script
mockado. Cada item marcado só com prova anexada.

- [x] **Favoritar muda o ícone na hora**: logado, na página de detalhe de um
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
- [x] **Acessível por teclado**: alcançar e ativar o botão de favoritar só
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

### Favoritar muda o ícone na hora — PASSOU (retestado após correção de CSS)

**Contexto**: uma sessão de QA anterior tinha encontrado aqui um bug real —
o coração ficava invisível (vermelho sobre vermelho) no instante do clique,
se o mouse permanecesse sobre o botão logo depois (gesto natural de clicar
e olhar o resultado). Causa raiz identificada naquela sessão:
`.botao-favoritar:hover` (especificidade 0,2,0) vencia
`.botao-favoritar--ativo` (0,1,0) e sobrescrevia `color: #fff` por
`color: var(--cor-fogo)`, deixando o SVG (`fill: currentColor`) da mesma
cor do fundo. Desde então, uma correção foi commitada em `web/src/index.css`
adicionando a regra `.botao-favoritar--ativo:hover`. Esta sessão repetiu o
teste exatamente como descrito, sem mexer no código antes de testar.

**Reprodução do teste** (sessão de QA nova, sem contexto de implementação,
plugin Claude in Chrome reconectado): logado como Conta A (sessão já
autenticada, cabeçalho mostrando `qa17-conta-a@teste.com` / "Sair"), acessei
`/personagens/10` (Mai — escolhido por não estar favoritado por nenhuma
conta no momento, confirmado antes via `sqlite3 ... "SELECT * FROM
favoritos"`). Estado inicial confirmado por zoom de screenshot: coração
vazio (contorno), e `aria-label="Adicionar aos favoritos"` via `find`.

Cliquei no botão (`computer` `left_click` real em `[935, 224]`) e, **sem
mover o mouse**, tirei um zoom de screenshot imediatamente da mesma região
(`[890,190,985,260]`):

- Resultado visual: coração **branco, nítido e visível**, sobre fundo
  vermelho sólido — não mais o círculo vermelho-sobre-vermelho do bug
  antigo.
- Confirmei que o teste reproduz de fato o cenário do bug (mouse ainda em
  cima, `:hover` realmente ativo) via `javascript_tool`:
  ```js
  const btn = document.querySelector('button[aria-label="Remover dos favoritos"]');
  btn.matches(':hover') → true
  btn.className → "botao-favoritar botao-favoritar--ativo personagem-detalhe__favoritar"
  ```
- Prova definitiva com `getComputedStyle` no mesmo estado (`:hover: true` +
  classe `--ativo` aplicada):
  ```js
  getComputedStyle(btn).color → "rgb(255, 255, 255)"   // branco
  getComputedStyle(btn).backgroundColor → "oklch(0.54 0.19 26)"  // vermelho
  ```
  Cor do texto/ícone branca sobre fundo vermelho, exatamente como deveria
  ser — a correção resolveu o conflito de especificidade de verdade, não só
  aparentemente.

`aria-label` também mudou corretamente para `"Remover dos favoritos"`
(confirmado via `find`) no mesmo instante.

**Conclusão**: bug de CSS corrigido. O item passa integralmente, incluindo
o caso específico (clicar sem mover o mouse) que antes falhava.

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

### Acessível por teclado — PASSOU (retestado em sessão nova do plugin; Tab funcionou)

**Contexto**: a sessão de QA anterior não conseguiu comprovar a metade
"alcançar o botão só com Tab" por uma limitação específica daquela sessão
do plugin Claude in Chrome — a tecla Tab não movia `document.activeElement`
a partir do carregamento da página (embora cliques e Enter/Espaço
funcionassem uma vez que o foco era colocado via `btn.focus()`). Já tinha
sido diagnosticado como problema da ferramenta, não da aplicação. Esta
sessão reiniciou o plugin (nova conexão) e repetiu o teste do zero.

**Preparação**: logado como Conta A, `navigate` para
`http://localhost:5173/personagens/10` (carregamento completo de página,
não navegação SPA). Antes de testar Tab, confirmei
`document.hasFocus() → false` — a aba ainda não tinha o foco do sistema
operacional. Um `left_click` real em uma área neutra da página (fora de
qualquer elemento interativo, `[300, 600]`) trouxe o foco:
`document.hasFocus() → true`, `document.activeElement` continuou `BODY`
(esperado, clique em área não interativa).

**Alcançando o botão só com Tab**: anexei um listener de `keydown` em
captura no `window` (mesmo método de diagnóstico da sessão anterior) e
comecei a apertar a tecla `Tab` pelo `computer` tool, uma de cada vez,
conferindo `document.activeElement` a cada passo. Desta vez o foco **se
moveu de verdade** a cada Tab — diferente da sessão anterior:

```
Tab 1 → <a> (link "Personagens"/logo, nav do cabeçalho)
Tab 2-4 → outros <a> do cabeçalho (Mural, Favoritos, …)
Tab 5 → <button class="cabecalho__botao-sair"> ("Sair")
Tab 6 → <button aria-label="Ativar tema escuro" class="cabecalho__botao-tema">
Tab 7 → <a class="personagem-detalhe__voltar"> ("Voltar para a listagem")
Tab 8 → <button aria-label="Remover dos favoritos" class="botao-favoritar botao-favoritar--ativo personagem-detalhe__favoritar">
```

No Tab 8, `document.activeElement` já era exatamente o botão de favoritar
(confirmado via `javascript_tool` lendo `tagName`/`ariaLabel`/`className`
do próprio `document.activeElement`, sem usar `find` nem `btn.focus()`) —
e o screenshot mostra visualmente o indicador de foco: contorno dourado
nítido ao redor do ícone de coração, o mesmo estilo de foco usado nos
outros elementos (botão "Sair", botão de tema) ao longo da cadeia de Tabs.

**Ativação por Enter**: com o foco real já no botão (estado favoritado,
`aria-label="Remover dos favoritos"`), apertei `Return` pelo `computer`
tool. O listener de `keydown` capturou o evento chegando genuinamente no
botão certo: `{"key":"Enter","target":"BUTTON","targetLabel":"Remover dos
favoritos"}`. Resultado real: `find` confirmou `aria-label="Adicionar aos
favoritos"` logo depois, e `sqlite3 ... "SELECT * FROM favoritos"` confirmou
que a linha `(6284118c-…, 10)` (Conta A, Mai) foi removida do banco.

**Ativação por Espaço**: refiz a navegação só-Tab a partir do topo da
página (a contagem de Tabs até "Sair" mudou levemente após o re-render,
de 5 para 8 — segui apertando Tab e conferindo `document.activeElement` a
cada passo até achar de novo o botão de favoritar, agora com
`aria-label="Adicionar aos favoritos"`, confirmando que o Tab continua
funcionando de forma consistente, não foi coincidência de uma vez só).
Apertei `space`: evento capturado no botão certo
(`{"key":" ","target":"BUTTON","targetLabel":"Adicionar aos favoritos"}`),
`find` confirmou `aria-label="Remover dos favoritos"` depois, e
`sqlite3 ...` confirmou a linha `(6284118c-…, 10)` de volta na tabela.

Ao final, desfavoritei Mai de novo (clique real) para deixar o banco no
mesmo estado de antes deste teste (só Aang↔Conta A e Katara↔Conta B),
confirmado por `sqlite3`.

**Conclusão**: a limitação relatada na sessão anterior era mesmo da
ferramenta (sessão específica do plugin), não da aplicação — nesta sessão
nova do Claude in Chrome, Tab moveu o foco real do DOM normalmente do
carregamento da página até o botão de favoritar, com indicador visual de
foco visível, e Enter/Espaço ativaram o botão de verdade (evento de
teclado real capturado no elemento certo, `aria-label` e banco
confirmando a mutação). Item passa integralmente.

### Resumo final

- Passou com prova real: **9/9** (Favoritar muda o ícone na hora, Favorito
  persiste no banco, Desfavoritar reverte, Persiste entre reloads, Sem
  login botão não aparece, Página "Meus favoritos", `/favoritos` sem
  login, Isolamento entre contas, Acessível por teclado).
- Histórico: os dois últimos itens ficaram pendentes em uma primeira
  sessão de QA — "Favoritar muda o ícone na hora" por um bug real de CSS
  (`.botao-favoritar:hover` vencendo `.botao-favoritar--ativo` por
  especificidade, coração invisível vermelho-sobre-vermelho no instante do
  clique) e "Acessível por teclado" por uma limitação daquela sessão do
  plugin Claude in Chrome (Tab não movia `document.activeElement`). Uma
  sessão de QA posterior (esta) confirmou, com prova real de navegador: o
  bug de CSS foi corrigido de verdade (`getComputedStyle` mostrando texto
  branco sobre fundo vermelho mesmo com `:hover` ativo) e o Tab funciona
  normalmente em uma sessão nova do plugin (foco real do DOM avançando
  visivelmente até o botão, com Enter e Espaço ativando de verdade).
