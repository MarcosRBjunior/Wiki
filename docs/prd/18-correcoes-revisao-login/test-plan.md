# Test Plan — Correções da revisão de código (cadastro/login)

Validado por uma sessão separada, sem contexto da implementação. Backend via
request real contra o servidor GraphQL rodando (`http://localhost:4000/`);
front-end via navegador real (Claude in Chrome) contra o `http://localhost:5173/`
com a API real no ar. Nunca CLI/script mockado como prova de comportamento de
interface. Cada item só é marcado com prova anexada na seção Evidência.

## API

- [x] **E-mail case-insensitive**: cadastrar `CaseTeste18@Ex.com` via
      `criarConta`; tentar cadastrar de novo como `caseteste18@ex.com` e
      confirmar erro "E-mail já cadastrado."; depois logar com
      `CASETESTE18@EX.COM` (mesma senha) e confirmar login bem-sucedido.
- [x] **Timing de login não vaza existência de e-mail**: medir o tempo de
      resposta de `login` para (a) e-mail cadastrado + senha errada e (b)
      e-mail inexistente, várias vezes cada; confirmar que as ordens de
      grandeza ficam próximas (sem gap de ~100x+ como antes).
- [x] **E-mail vazio rejeitado**: chamar `criarConta` com `email: ""` e
      confirmar `GraphQLError` amigável, sem linha nova em `usuarios`.
- [x] **Violação de UNIQUE tratada**: forçar duas contas com o mesmo e-mail
      (ex.: chamando o resolver diretamente em paralelo ou inserindo direto
      no banco e depois chamando `criarConta`) e confirmar erro amigável, não
      stack trace do SQLite.
- [x] **JWT com algoritmo fixo**: inspecionar o código/`jwt.verify` e
      confirmar `algorithms: ['HS256']` explícito; token assinado e validado
      normalmente por um login real.
- [x] **bcrypt não bloqueia o event loop**: com a API rodando, disparar um
      login (bcrypt) e, durante a espera, mandar em paralelo uma query
      simples `personagens`; confirmar que a query simples não fica presa
      atrás do bcrypt.
      > Falhou na primeira rodada de validação (query simples presa atrás do
      > bcrypt síncrono na thread principal). Corrigido movendo o
      > hash/compare pra uma worker thread dedicada; reteste confirmou que
      > passou a funcionar. Ver Evidência abaixo (seção "Reteste — bcrypt em
      > worker thread").
- [x] **Código morto removido**: confirmar que `buscarUsuarioPorId` não
      existe mais em `api/data/usuariosStore.js` e que `npm test` da API
      continua passando.
- [x] **Testes não sujam o banco de dev**: rodar `npm test` na API duas vezes
      seguidas e confirmar (via inspeção do arquivo `personagens.db` ou
      contagem de linhas de `usuarios`) que não sobra lixo de teste
      acumulando.

## Front-end

- [x] **Falha pós-sucesso não é silenciosa**: no cadastro ou login, simular
      falha depois da mutation ter sucesso (ex.: via devtools, bloquear a
      navegação ou forçar erro em `entrar()`) e confirmar que aparece algum
      feedback visível, em vez de a tela travar sem explicação.
- [x] **Sessão sincroniza entre abas**: logar em uma aba, abrir uma segunda
      aba da mesma origem já logada, deslogar na primeira e confirmar que a
      segunda aba também reflete o logout (cabeçalho sem e-mail/"Sair").
- [x] **Cache do Apollo não vaza entre usuários**: logar como usuário A,
      deslogar, logar como usuário B na mesma aba, e confirmar que nenhum
      dado específico de A (ex.: cabeçalho, estado de UI dependente de
      sessão) aparece pra B antes de uma resposta de rede nova.
- [x] **Erro claro sem provider**: confirmar (via teste automatizado ou
      render isolado) que usar `useAutenticacao()` fora do
      `ProvedorAutenticacao` lança mensagem explícita, não `TypeError`
      genérico.
- [x] **Cadastro e login continuam funcionando após deduplicação**: com o
      componente/hook compartilhado, cadastrar uma conta nova pela UI e,
      separadamente, logar com uma conta existente pela UI — os dois fluxos
      continuam funcionando ponta a ponta.

## Documentação

- [x] **`ambiente.md` bate com a realidade**: seguir os comandos documentados
      do zero (incluindo a exigência de `JWT_SECRET`) e confirmar que batem
      com o comportamento real; contagem de testes documentada confere com
      `npm test` da API e do web.

## Evidência

_(preenchida pela sessão de validação, sem contexto da implementação, via
requests reais contra a API em `http://localhost:4000/` e navegador real
contra `http://localhost:5173/`.)_

### API

**E-mail case-insensitive.** Requests reais via `curl -X POST http://localhost:4000/`:
1. `criarConta(email: "CaseTeste18@Ex.com", senha: "senhaSegura123")` →
   sucesso, `usuario.email` retornado já normalizado como
   `"caseteste18@ex.com"`.
2. `criarConta(email: "caseteste18@ex.com", senha: "outraSenha123")` →
   `GraphQLError` `"E-mail já cadastrado."` (`EMAIL_JA_CADASTRADO`).
3. `login(email: "CASETESTE18@EX.COM", senha: "senhaSegura123")` → sucesso,
   token JWT válido retornado para o mesmo usuário.

**Timing de login não vaza existência de e-mail.** Script Node
(`fetch` + `performance.now()`), 8 medições de cada:
- E-mail existente (`caseteste18@ex.com`) + senha errada: `96.0, 56.7, 56.0,
  55.8, 56.1, 55.2, 56.0, 56.0` ms → média 60.97ms (a primeira é warm-up).
- E-mail inexistente (`nao-existe-N@ex.com`): `57.0, 56.9, 55.6, 55.4, 55.3,
  54.9, 55.1, 54.8` ms → média 55.63ms.

Mesma ordem de grandeza (diferença de ~5ms, nada perto do gap de 100x+ que
existiria sem o `HASH_FALSO` em `usuariosStore.js`).

**E-mail vazio rejeitado.** Contagem de `usuarios` antes: 21. Request
`criarConta(email: "", senha: "senhaSegura123")` → `GraphQLError`
`"E-mail inválido."` (`EMAIL_INVALIDO`). Contagem de `usuarios` depois: 21
(inalterada, confirmado lendo `api/data/personagens.db` com
`better-sqlite3` num script Node).

**Violação de UNIQUE tratada.** Duas chamadas `criarConta` com o mesmo
e-mail novo (`race-teste-18@ex.com`) disparadas em paralelo (`curl ... &`
duas vezes, `wait`). Resposta 1: sucesso, conta criada. Resposta 2:
`GraphQLError` `"E-mail já cadastrado."` — e o stack trace da resposta
aponta para `resolvers.js:43:17`, que é a linha dentro do bloco `catch`
*depois* do `INSERT` (não a checagem prévia em `resolvers.js:35`),
confirmando que foi mesmo a constraint `UNIQUE` do SQLite que disparou o
erro amigável, não o `SELECT` prévio.

**JWT com algoritmo fixo.** Código em `api/autenticacao.js` confirma
`jwt.sign(..., { algorithm: 'HS256' })` e
`jwt.verify(..., { algorithms: ['HS256'] })` explícitos. Token real
retornado por um `login` bem-sucedido, header decodificado
(`base64 -d` da primeira parte do JWT): `{"alg":"HS256","typ":"JWT"}`.

**bcrypt não bloqueia o event loop — 1ª rodada, FALHOU (corrigido depois,
ver "Reteste — bcrypt em worker thread" mais abaixo).** Script Node
disparando um
`login` (que roda bcrypt, `SALT_ROUNDS = 10`) e, 10ms depois de iniciado
(login ainda em voo), uma query `{ personagens { id } }` em paralelo, 6
rodadas:

| login (ms) | query simples disparada 10ms depois (ms) |
|---|---|
| 96.5 | 70.5 |
| 55.6 | 45.8 |
| 56.9 | 46.5 |
| 55.6 | 46.6 |
| 57.1 | 46.5 |
| 55.5 | 46.5 |

Baseline da mesma query simples isolada, sem nenhum login concorrente:
`1.3, 1.3, 1.4, 1.8, 1.6` ms.

A query simples, que sozinha responde em ~1-2ms, levou ~46-70ms quando
disparada durante um `login()` em andamento — quase o tempo que falta pro
login terminar, não o baseline. Isso indica que o event loop **fica
bloqueado** durante o cálculo do bcrypt, apesar do código usar a API
assíncrona (`await bcrypt.hash`/`bcrypt.compare`, sem `*Sync`). Investigando
`node_modules/bcryptjs/index.js`: a função interna `_hash`/`_crypt` só cede
o loop via `nextTick` entre fatias de trabalho quando o cálculo de uma
rodada ultrapassa `MAX_EXECUTION_TIME = 100ms` (linha ~995); com
`SALT_ROUNDS = 10` o cálculo inteiro leva ~55-60ms (menos que 100ms), então
roda de uma vez só, de forma síncrona, sem nunca ceder o loop. Ou seja: o
código faz a troca de API certa (assíncrona), mas na prática, com esse
número de rounds, isso não impede o bloqueio — item deixado **sem check**
nesta rodada.

**Reteste — bcrypt em worker thread (correção aplicada depois da 1ª
rodada).** Implementação mudou: `usuariosStore.js` agora roda
`bcrypt.hash`/`bcrypt.compare` dentro de `api/data/bcryptWorker.js`, numa
`node:worker_threads` `Worker` nova por chamada (criada e terminada a cada
`hash`/`compare`, sem worker persistente). Reteste com o mesmo método do
item acima (login/`criarConta` disparado, query `{ personagens { id } }`
disparada 10ms depois, em voo junto):

| login (ms) | query simples disparada 10ms depois (ms) |
|---|---|
| 126.7 | 19.2 (1ª rodada, warm-up) |
| 88.9 | 2.5 |
| 89.9 | 2.2 |
| 89.8 | 2.3 |
| 85.8 | 4.0 |
| 90.4 | 1.8 |

Baseline da query simples isolada, sem nada concorrente: `1.6, 1.3, 1.2,
1.2, 1.1` ms (média 1.28ms). Média da query concorrendo com o login: 5.34ms
(puxada pelo warm-up de 19.2ms; sem ele, 2.2-4.0ms) — nada como os
~46-70ms da 1ª rodada. Repeti com `criarConta` (que roda `bcrypt.hash`, não
só `compare`) disparado 10ms antes de 4 queries simples: `criarConta` levou
90.4/90.1/90.8/99.5ms, e a query simples concorrente ficou em
1.7/2.2/2.3/2.2ms — de novo, perto do baseline isolado. Confirma que a
worker thread resolveu o bloqueio: quem fica preso agora é só a worker
descartável, a thread principal (que atende as outras requisições) segue
livre. (Trade-off esperado: cada `login`/`criarConta` ficou ~30-40ms mais
lento por causa do overhead de criar/terminar a worker a cada chamada —
correto do ponto de vista deste item, que é sobre não travar *outras*
requisições, não sobre a latência da própria chamada de auth.)

`npm test` da API rodado duas vezes seguidas com `timeout 30` (pra pegar de
propósito qualquer travamento do processo, já que uma versão anterior da
correção tinha um bug em que a worker ficava presa por causa de um listener
`message` reaproveitado): as duas rodadas terminaram sozinhas, exit code 0,
sem precisar do timeout matar nada, 11/11 testes passando em ~910ms cada
vez.

**Código morto removido.** `grep -rn "buscarUsuarioPorId" api/` (excluindo
`node_modules`): nenhuma ocorrência. `npm test` da API: 11/11 passando.

**Testes não sujam o banco de dev.** Contagem de `usuarios` em
`api/data/personagens.db` (lida com `better-sqlite3` via script Node):
antes do 1º `npm test`: 20. Depois do 1º `npm test`: 20. Depois do 2º
`npm test` (rodado em seguida): 20. Sem crescimento — os testes de auth
rodam mesmo contra `:memory:` (`api/data/db.js` usa
`NODE_ENV === 'test' ? ':memory:' : ...`, e `npm test` exporta
`NODE_ENV=test`).

### Front-end (navegador real, Claude in Chrome, contra `localhost:5173`
com a API real no ar)

**Falha pós-sucesso não é silenciosa.** Login real via UI
(`caseteste18@ex.com` / `senhaSegura123`), com
`window.__APOLLO_CLIENT__.clearStore` sobrescrito via devtools (console) só
pra lançar erro (a mutation em si roda de verdade contra a API real). Depois
do submit: a tela **ficou na página de login** e mostrou a mensagem
"Conta autenticada, mas houve um problema ao continuar. Recarregue a página
e tente de novo." — exatamente o fallback de `useFormularioAuth.js`. O
console mostrou o stack real: `enviar (useFormularioAuth.js:22)` →
`ProvedorAutenticacao.jsx:27` (a chamada `client.clearStore()` dentro de
`entrar()`) → capturado pelo `catch`, logado via `console.error('Falha ao
concluir a autenticação após a resposta da API:', erro)`. (Tentativa
anterior de forçar a falha sobrescrevendo `window.history.pushState`
não funcionou — o React Router 7 não usa essa referência diretamente pra
navegação SPA — por isso a segunda tentativa mirou `entrar()`/`clearStore`
como o próprio test-plan sugere.)

**Sessão sincroniza entre abas.** Aba 1 logada como `caseteste18@ex.com`
(header mostrando e-mail + "Sair"). Aba 2 aberta na mesma origem
(`localhost:5173/`), carregou já logada (lê `localStorage` no mount) com o
mesmo header. Cliquei "Sair" na aba 1. **Sem recarregar a aba 2**, novo
screenshot da aba 2 mostrou o header já como "Entrar"/"Criar conta" —
confirma que o listener do evento `storage` sincronizou o logout entre abas
em tempo real.

**Cache do Apollo não vaza entre usuários.** Com a SPA montada uma única
vez (sem reload completo entre os passos, pra não resetar o cache sozinho):
naveguei pra `/personagens` → `cache.extract()` tinha 24 `Personagem:*` +
`ROOT_QUERY`. Cliquei "Sair" (chama `client.clearStore()`) → `cache.extract()`
caiu pra só `["Personagem:5","ROOT_QUERY"]` (o refetch da própria página de
Mural pra onde o logout redireciona, não sobra nada dos outros 23
personagens da lista anterior). Loguei como outro usuário
(`qa-ui-18-cadastro@teste.com`) na mesma aba → header atualizou
imediatamente pro e-mail correto, sem qualquer resquício visual do usuário
anterior.

**Erro claro sem provider.** Rodado `npm test` real do `web/`
(`vitest run`): `2 Test Files passed, 10 Tests passed`. O teste
`src/utils/autenticacao.test.js` (`useAutenticacao lança erro claro quando
usado fora do ProvedorAutenticacao`) executa `renderHook(() =>
useAutenticacao())` sem provider e confirma
`toThrowError('useAutenticacao deve ser usado dentro de
ProvedorAutenticacao')` — passou.

**Cadastro e login continuam funcionando via UI.** Fluxo 1 (cadastro): abri
`/cadastro`, preenchi e-mail novo (`qa-ui-18-cadastro@teste.com`) + senha,
cliquei "Criar conta" → redirecionou pro Mural (`/`) com header mostrando
o e-mail recém-criado + "Sair". Fluxo 2 (login): abri `/login`, preenchi
`caseteste18@ex.com` / `senhaSegura123`, cliquei "Entrar" → redirecionou
pro Mural com header mostrando esse e-mail + "Sair". Os dois fluxos usam o
`FormularioAuth`/`useFormularioAuth` compartilhados e funcionaram ponta a
ponta.

### Documentação

**`ambiente.md` bate com a realidade.**
- `JWT_SECRET` obrigatório: rodei `node api/index.js` com `cwd` em `/tmp`
  (sem `JWT_SECRET` no shell e sem `.env` alcançável a partir de `/tmp`, sem
  tocar no `api/.env` real) → crashou imediatamente com
  `Error: JWT_SECRET não definido. Configure essa variável de ambiente
  antes de subir a API (ver .env.example).` — bate com o documentado. O
  servidor real em `localhost:4000` (que tem `JWT_SECRET` no `.env`) seguiu
  respondendo normalmente depois (`{ status }` → `"ok"`), confirmando que o
  teste não afetou o processo real.
- Contagem de testes da API: `npm test` real → `11 tests, 11 pass, 0 fail`,
  bate com "11 testes, todos passando" documentado.
- Contagem de testes do web: `npm test` real (`vitest run`) → `2 Test Files
  passed, 10 Tests passed`, bate com "10 testes em 2 arquivos" documentado.
