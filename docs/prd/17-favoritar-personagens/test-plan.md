# Test Plan — Favoritar personagens

Validado por uma sessão separada de QA, sem contexto da implementação. UI via
navegador real (Claude in Chrome), backend via request real contra o servidor
GraphQL rodando — nunca CLI, request direto sem servidor real ou script
mockado. Cada item marcado só com prova anexada.

- [ ] **Favoritar muda o ícone na hora**: logado, na página de detalhe de um
      personagem, clicar no botão de favoritar; confirmar que o ícone muda
      (vazio → cheio) sem reload.
- [ ] **Favorito persiste no banco**: depois de favoritar, inspecionar a
      tabela `favoritos` no SQLite e confirmar a linha `(usuario_id,
      personagem_id)` correspondente.
- [ ] **Desfavoritar reverte**: clicar de novo no botão; ícone volta ao
      estado vazio e a linha correspondente some/é marcada como removida no
      banco.
- [ ] **Persiste entre reloads**: favoritar, dar F5 na página de detalhe;
      confirmar que o ícone continua no estado "favoritado".
- [ ] **Sem login, botão não aparece (ou aparece bloqueado)**: acessar a
      mesma página de detalhe deslogado; confirmar o comportamento decidido
      na implementação pra esse caso.
- [ ] **Página "Meus favoritos" lista o que foi favoritado**: acessar
      `/favoritos` logado e confirmar que os personagens favoritados
      aparecem, com os mesmos cards da listagem principal.
- [ ] **`/favoritos` sem login**: acessar a rota deslogado e confirmar
      redirecionamento pra `/login` (ou mensagem clara, conforme decidido).
- [ ] **Isolamento entre contas**: favoritar um personagem com a conta A,
      logar com a conta B e confirmar que esse personagem NÃO aparece como
      favorito pra B.
- [ ] **Acessível por teclado**: alcançar e ativar o botão de favoritar só
      com Tab + Enter/Espaço, e confirmar `aria-label` descrevendo a ação do
      próximo clique.

## Evidência

_(preenchida pela sessão de validação, não pela implementação)_
