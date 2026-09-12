# Test Plan — Correções da revisão de código (cadastro/login)

Validado por uma sessão separada, sem contexto da implementação. Backend via
request real contra o servidor GraphQL rodando (`http://localhost:4000/`);
front-end via navegador real (Claude in Chrome) contra o `http://localhost:5173/`
com a API real no ar. Nunca CLI/script mockado como prova de comportamento de
interface. Cada item só é marcado com prova anexada na seção Evidência.

## API

- [ ] **E-mail case-insensitive**: cadastrar `CaseTeste18@Ex.com` via
      `criarConta`; tentar cadastrar de novo como `caseteste18@ex.com` e
      confirmar erro "E-mail já cadastrado."; depois logar com
      `CASETESTE18@EX.COM` (mesma senha) e confirmar login bem-sucedido.
- [ ] **Timing de login não vaza existência de e-mail**: medir o tempo de
      resposta de `login` para (a) e-mail cadastrado + senha errada e (b)
      e-mail inexistente, várias vezes cada; confirmar que as ordens de
      grandeza ficam próximas (sem gap de ~100x+ como antes).
- [ ] **E-mail vazio rejeitado**: chamar `criarConta` com `email: ""` e
      confirmar `GraphQLError` amigável, sem linha nova em `usuarios`.
- [ ] **Violação de UNIQUE tratada**: forçar duas contas com o mesmo e-mail
      (ex.: chamando o resolver diretamente em paralelo ou inserindo direto
      no banco e depois chamando `criarConta`) e confirmar erro amigável, não
      stack trace do SQLite.
- [ ] **JWT com algoritmo fixo**: inspecionar o código/`jwt.verify` e
      confirmar `algorithms: ['HS256']` explícito; token assinado e validado
      normalmente por um login real.
- [ ] **bcrypt não bloqueia o event loop**: com a API rodando, disparar um
      login (bcrypt) e, durante a espera, mandar em paralelo uma query
      simples `personagens`; confirmar que a query simples não fica presa
      atrás do bcrypt.
- [ ] **Código morto removido**: confirmar que `buscarUsuarioPorId` não
      existe mais em `api/data/usuariosStore.js` e que `npm test` da API
      continua passando.
- [ ] **Testes não sujam o banco de dev**: rodar `npm test` na API duas vezes
      seguidas e confirmar (via inspeção do arquivo `personagens.db` ou
      contagem de linhas de `usuarios`) que não sobra lixo de teste
      acumulando.

## Front-end

- [ ] **Falha pós-sucesso não é silenciosa**: no cadastro ou login, simular
      falha depois da mutation ter sucesso (ex.: via devtools, bloquear a
      navegação ou forçar erro em `entrar()`) e confirmar que aparece algum
      feedback visível, em vez de a tela travar sem explicação.
- [ ] **Sessão sincroniza entre abas**: logar em uma aba, abrir uma segunda
      aba da mesma origem já logada, deslogar na primeira e confirmar que a
      segunda aba também reflete o logout (cabeçalho sem e-mail/"Sair").
- [ ] **Cache do Apollo não vaza entre usuários**: logar como usuário A,
      deslogar, logar como usuário B na mesma aba, e confirmar que nenhum
      dado específico de A (ex.: cabeçalho, estado de UI dependente de
      sessão) aparece pra B antes de uma resposta de rede nova.
- [ ] **Erro claro sem provider**: confirmar (via teste automatizado ou
      render isolado) que usar `useAutenticacao()` fora do
      `ProvedorAutenticacao` lança mensagem explícita, não `TypeError`
      genérico.
- [ ] **Cadastro e login continuam funcionando após deduplicação**: com o
      componente/hook compartilhado, cadastrar uma conta nova pela UI e,
      separadamente, logar com uma conta existente pela UI — os dois fluxos
      continuam funcionando ponta a ponta.

## Documentação

- [ ] **`ambiente.md` bate com a realidade**: seguir os comandos documentados
      do zero (incluindo a exigência de `JWT_SECRET`) e confirmar que batem
      com o comportamento real; contagem de testes documentada confere com
      `npm test` da API e do web.

## Evidência

_(preenchida pela sessão de validação, não pela implementação)_
