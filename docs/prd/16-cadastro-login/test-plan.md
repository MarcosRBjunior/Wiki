# Test Plan — Cadastro e login local

Validado por uma sessão separada de QA, sem contexto da implementação. UI via
navegador real (Claude in Chrome), backend via request real contra o servidor
GraphQL rodando — nunca CLI, request direto sem servidor real ou script
mockado. Cada item marcado só com prova anexada (o que foi visto/screenshot/
resposta real da API).

- [x] **Cadastro cria conta e loga automaticamente**: preencher o formulário
      de `/cadastro` com e-mail novo e senha válida, enviar, e confirmar que a
      tela muda pra estado autenticado (Cabeçalho mostra o e-mail) sem exigir
      login manual.
- [x] **Cadastro com e-mail duplicado é rejeitado**: repetir o cadastro com o
      mesmo e-mail usado no item anterior; confirmar mensagem de erro na tela
      e que o banco não ganhou uma segunda linha pra esse e-mail.
- [x] **Login com credenciais corretas funciona**: deslogar, ir em `/login`,
      entrar com o e-mail/senha criados acima; confirmar redirecionamento pro
      mural e Cabeçalho autenticado.
- [x] **Login com senha errada é rejeitado**: tentar logar com o e-mail
      correto e senha errada; confirmar mensagem de erro genérica na tela e
      que nenhuma sessão foi iniciada.
- [x] **Cabeçalho reflete o estado de sessão**: comparar visualmente o
      Cabeçalho deslogado (links Login/Criar conta) com o logado (e-mail +
      botão Sair).
- [x] **Logout encerra a sessão**: com sessão ativa, clicar em "Sair" e
      confirmar que o Cabeçalho volta ao estado deslogado e que uma ação que
      exigiria login deixa de funcionar.
- [x] **Sessão persiste após reload**: logado, apertar F5; confirmar que a
      sessão continua ativa (Cabeçalho ainda mostra o e-mail).
- [x] **Formulários acessíveis por teclado**: navegar até os campos de
      e-mail/senha só com Tab, preencher e enviar só com teclado (sem clique
      de mouse), em ambas as páginas.
- [x] **Senha armazenada como hash**: inspecionar a linha criada em
      `usuarios` no SQLite (`api/data/personagens.db`) e confirmar que
      `senha_hash` não é a senha em texto puro.

## Evidência

_(preenchida pela sessão de validação, não pela implementação)_

Validação feita em `http://localhost:5173/` via Claude in Chrome (navegador
real, sessão de QA sem contexto de implementação), com o backend real
respondendo em `http://localhost:4000/`. Contas de teste usadas:
`qa-16-signup-1@teste.com` / `SenhaValida123` (fluxo principal, criada via
mouse) e `qa-16-keyboard-cadastro@teste.com` / `SenhaTeclado123` (criada só
com teclado, para o item de acessibilidade).

1. **Cadastro cria conta e loga automaticamente**: em `/cadastro`, preenchi
   e-mail `qa-16-signup-1@teste.com` e senha `SenhaValida123` e cliquei
   "Criar conta". A tela mudou imediatamente: a URL foi para `/` (mural) e o
   Cabeçalho passou a mostrar `qa-16-signup-1@teste.com` e o botão "Sair" no
   lugar de "Entrar"/"Criar conta" — sem nenhum passo de login manual.
   Confirmei no SQLite que a linha foi criada de fato:
   `sqlite3 api/data/personagens.db "SELECT id, email, senha_hash, criado_em
   FROM usuarios WHERE email='qa-16-signup-1@teste.com'"` retornou
   `6b46af35-3ee3-4653-a393-242fe4325f6b|qa-16-signup-1@teste.com|$2b$10$ELnf
   GO48N20luZ3JbT3TSuIF9tGbp.s2YD36oA3/v7VvhVwgMw80q|2026-09-12T02:54:43.575Z`.

2. **Cadastro com e-mail duplicado é rejeitado**: voltei em `/cadastro`
   (acessível mesmo autenticado) e submeti de novo o mesmo e-mail
   `qa-16-signup-1@teste.com` com uma senha diferente
   (`OutraSenha456`). A tela exibiu, em vermelho, abaixo do campo de senha:
   "E-mail já cadastrado." — sem navegar nem alterar o Cabeçalho. Reconferi o
   banco: `SELECT COUNT(*), GROUP_CONCAT(id) FROM usuarios WHERE
   email='qa-16-signup-1@teste.com'` retornou `1|6b46af35-3ee3-4653-a393-
   242fe4325f6b` — mesmo id de antes, nenhuma linha nova criada.

3. **Login com credenciais corretas funciona**: cliquei "Sair" (ver item 6),
   fui em `/login` e entrei com `qa-16-signup-1@teste.com` /
   `SenhaValida123`. A rede confirmou uma requisição real ao backend
   (`read_network_requests` mostrou `POST http://localhost:4000/` →
   `200`), a URL mudou para `http://localhost:5173/` (mural) e o Cabeçalho
   passou a mostrar `qa-16-signup-1@teste.com` + "Sair" novamente. Também
   inspecionei `localStorage.getItem('wiki-sessao')` no navegador, que
   continha um JWT (`eyJhbGciOiJIUzI1NiIs...`) com payload decodificável
   contendo `usuarioId` igual ao id da conta criada, mais o objeto
   `usuario` com o e-mail correto — evidência de que uma sessão real (não
   só um estado de UI) foi estabelecida.

4. **Login com senha errada é rejeitado**: em `/login`, tentei
   `qa-16-signup-1@teste.com` com a senha errada `SenhaErrada999`. A tela
   mostrou a mensagem genérica "E-mail ou senha inválidos." (não indica se o
   problema é o e-mail ou a senha) e o Cabeçalho continuou mostrando
   "Entrar"/"Criar conta" — nenhuma sessão iniciada, confirmado também pela
   ausência de mudança de URL e pela persistência do estado deslogado.

5. **Cabeçalho reflete o estado de sessão**: comparação direta de
   screenshots. Deslogado: Cabeçalho mostra os links "Personagens", "Mural",
   "Entrar", "Criar conta" e o botão de tema. Logado (após cadastro/login):
   os links "Entrar"/"Criar conta" somem e em seu lugar aparecem o e-mail da
   conta (`qa-16-signup-1@teste.com`) em texto simples e um botão "Sair",
   mantendo "Personagens"/"Mural"/tema inalterados — troca visível e
   consistente nas duas transições (login e logout).

6. **Logout encerra a sessão**: com a sessão ativa (Cabeçalho mostrando
   `qa-16-signup-1@teste.com`), cliquei em "Sair". Imediatamente a URL foi
   para `/` e o Cabeçalho voltou a mostrar "Entrar"/"Criar conta". Confirmei
   também no nível de dados: antes do clique,
   `localStorage.getItem('wiki-sessao')` retornava o objeto `{token,
   usuario}` com o JWT; logo depois do clique, a mesma chamada retornou
   `null` — a sessão foi de fato destruída no cliente, não só escondida na
   tela. Ressalva: o schema GraphQL atual só expõe as mutations `criarConta`
   e `login` (confirmado via introspecção —
   `{ __schema { mutationType { fields { name } } } }` retorna só essas
   duas); não existe ainda nenhuma ação protegida por login na aplicação
   (favoritar personagens é a tarefa 17, dependente desta e ainda não
   implementada), então o critério "uma ação que exigiria login deixa de
   funcionar" não tem hoje nenhuma ação candidata para testar além do
   próprio estado do Cabeçalho — o que foi validado.

7. **Sessão persiste após reload**: logado como
   `qa-16-signup-1@teste.com`, usei `navigate` para recarregar
   `http://localhost:5173/` por completo (reload real de documento, não
   navegação SPA). Após o carregamento, o Cabeçalho continuou mostrando o
   e-mail e o botão "Sair", e `localStorage.getItem('wiki-sessao') !== null`
   avaliou `true` no console da página — a sessão sobreviveu ao reload sem
   exigir novo login.

8. **Formulários acessíveis por teclado**: em ambas as páginas, cliquei uma
   vez numa área neutra da página (fora de qualquer campo) só para tirar o
   foco do `document.body`, e a partir daí usei exclusivamente Tab/Enter —
   nenhum clique em campo ou botão do formulário.
   - `/cadastro`: a ordem de foco confirmada via `document.activeElement`
     foi logo → "Personagens" → "Mural" → "Entrar" → "Criar conta" (link do
     Cabeçalho) → botão de tema → `input#cadastro-email` → digitei
     `qa-16-keyboard-cadastro@teste.com` → Tab → `input#cadastro-senha` →
     digitei `SenhaTeclado123` → Tab → `button#submit "Criar conta"` →
     Enter. O cadastro foi criado e a conta logou automaticamente (Cabeçalho
     passou a mostrar `qa-16-keyboard-cadastro@teste.com` + "Sair",
     redirecionado para `/`) — tudo sem mouse nos campos.
   - `/login`: mesma sequência de Tab a partir do corpo da página levou a
     `input#login-email` → digitei `qa-16-signup-1@teste.com` → Tab →
     `input#login-senha` → digitei `SenhaValida123` → Tab →
     `button#submit "Entrar"` → Enter. Login bem-sucedido, redirecionado
     para o mural com Cabeçalho autenticado.
   - Confirmei também a associação de `label`/`id` via
     `document.querySelectorAll('label')`, que retornou
     `[{"for":"cadastro-email","text":"E-mail"},{"for":"cadastro-senha",
     "text":"Senha"}]` — cada campo tem um `label` de verdade apontando pro
     `id` do input (reforçado pela árvore de acessibilidade, que já
     nomeava os campos como "E-mail"/"Senha").

9. **Senha armazenada como hash**: inspecionei diretamente
   `api/data/personagens.db` depois dos cadastros de teste:
   `SELECT email, senha_hash, length(senha_hash) FROM usuarios WHERE email
   IN ('qa-16-signup-1@teste.com','qa-16-keyboard-cadastro@teste.com')`
   retornou:
   - `qa-16-signup-1@teste.com` → `$2b$10$ELnfGO48N20luZ3JbT3TSuIF9tGbp.
     s2YD36oA3/v7VvhVwgMw80q` (60 caracteres)
   - `qa-16-keyboard-cadastro@teste.com` → `$2b$10$bDuJnAtX7sKhFjFLe9peb.
     /7/Mu3.BQgUAyKUMG07fgtob6lSaj2G` (60 caracteres)

   Ambos no formato bcrypt (`$2b$10$...`, prefixo de custo 10, 60
   caracteres), completamente diferentes das senhas em texto puro
   digitadas (`SenhaValida123` / `SenhaTeclado123`) — sem qualquer
   ocorrência da senha original na string armazenada.

Todos os 9 itens do Test Plan foram validados com prova concreta (screenshots,
leitura de `localStorage`/JWT via JavaScript no navegador real, requisição de
rede real capturada, e consultas diretas ao SQLite). Nenhum item ficou sem
cobertura; a única ressalva registrada é a do item 6, sobre a ausência atual
de uma ação protegida por login no escopo da tarefa 16 (dependência da tarefa
17, ainda não implementada) — o comportamento de sessão em si foi validado
por completo.
