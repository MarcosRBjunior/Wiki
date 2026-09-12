# Test Plan — Cadastro e login local

Validado por uma sessão separada de QA, sem contexto da implementação. UI via
navegador real (Claude in Chrome), backend via request real contra o servidor
GraphQL rodando — nunca CLI, request direto sem servidor real ou script
mockado. Cada item marcado só com prova anexada (o que foi visto/screenshot/
resposta real da API).

- [ ] **Cadastro cria conta e loga automaticamente**: preencher o formulário
      de `/cadastro` com e-mail novo e senha válida, enviar, e confirmar que a
      tela muda pra estado autenticado (Cabeçalho mostra o e-mail) sem exigir
      login manual.
- [ ] **Cadastro com e-mail duplicado é rejeitado**: repetir o cadastro com o
      mesmo e-mail usado no item anterior; confirmar mensagem de erro na tela
      e que o banco não ganhou uma segunda linha pra esse e-mail.
- [ ] **Login com credenciais corretas funciona**: deslogar, ir em `/login`,
      entrar com o e-mail/senha criados acima; confirmar redirecionamento pro
      mural e Cabeçalho autenticado.
- [ ] **Login com senha errada é rejeitado**: tentar logar com o e-mail
      correto e senha errada; confirmar mensagem de erro genérica na tela e
      que nenhuma sessão foi iniciada.
- [ ] **Cabeçalho reflete o estado de sessão**: comparar visualmente o
      Cabeçalho deslogado (links Login/Criar conta) com o logado (e-mail +
      botão Sair).
- [ ] **Logout encerra a sessão**: com sessão ativa, clicar em "Sair" e
      confirmar que o Cabeçalho volta ao estado deslogado e que uma ação que
      exigiria login deixa de funcionar.
- [ ] **Sessão persiste após reload**: logado, apertar F5; confirmar que a
      sessão continua ativa (Cabeçalho ainda mostra o e-mail).
- [ ] **Formulários acessíveis por teclado**: navegar até os campos de
      e-mail/senha só com Tab, preencher e enviar só com teclado (sem clique
      de mouse), em ambas as páginas.
- [ ] **Senha armazenada como hash**: inspecionar a linha criada em
      `usuarios` no SQLite (`api/data/personagens.db`) e confirmar que
      `senha_hash` não é a senha em texto puro.

## Evidência

_(preenchida pela sessão de validação, não pela implementação)_
