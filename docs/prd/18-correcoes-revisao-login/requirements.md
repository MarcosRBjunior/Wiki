# Requisitos — Correções da revisão de código (cadastro/login, tarefa 16)

Origem: `/code-review` rodado sobre o commit `90a1458` (PR #20, tarefa 16 —
cadastro/login). 14 dos 15 achados viram requisito de código aqui. O 15º
achado (checks do test-plan da tarefa 16 marcados pelo próprio implementador,
violando a regra 3 do `CLAUDE.md`) não é corrigível retroativamente — não
gera requisito, só reforça que esta tarefa precisa de validação em sessão
separada de verdade.

Branch: `fix/18-correcoes-revisao-login`.

## Segurança / correção — API

- [x] Cadastro e login tratam e-mail sem diferenciar maiúsculas/minúsculas
      (normalizado antes de salvar e antes de buscar), então
      `User@Ex.com` e `user@ex.com` são o mesmo usuário — sem duplicata, sem
      lockout.
- [x] `login()` não vaza, por tempo de resposta, se um e-mail existe ou não:
      o tempo de resposta para e-mail inexistente é comparável ao de senha
      errada (roda uma comparação bcrypt mesmo quando o usuário não existe).
- [x] `criarConta` rejeita e-mail vazio ou em formato inválido com o mesmo
      `GraphQLError` amigável usado pros outros casos de validação — não cria
      conta com `email: ""`.
- [x] `criarConta` trata violação da constraint `UNIQUE` do banco (não só o
      `SELECT` prévio) devolvendo o erro amigável "E-mail já cadastrado.",
      não um erro cru do SQLite.
- [x] `jwt.verify` (em `api/autenticacao.js`) fixa `algorithms: ['HS256']`
      explicitamente, e `jwt.sign` idem.
- [ ] Hash e verificação de senha (`bcrypt`) não bloqueiam o event loop —
      usam a API assíncrona do `bcryptjs`.
      > Verificado de verdade e **não se sustenta na prática**: o código usa
      > mesmo a API assíncrona (`await bcrypt.hash`/`bcrypt.compare`, sem
      > `*Sync`), mas a implementação do `bcryptjs` só cede o event loop
      > (`nextTick`) entre "fatias" de trabalho quando o cálculo do custo
      > (`SALT_ROUNDS = 10`) ultrapassa `MAX_EXECUTION_TIME = 100ms`. Como o
      > hash/compare aqui leva ~55-60ms (menos que 100ms), a rodada inteira
      > roda de uma vez, síncrona, sem nunca ceder o loop. Prova real: ver
      > item "bcrypt não bloqueia o event loop" no test-plan.md — uma query
      > `{ personagens { id } }` que sozinha leva ~1-2ms passou a levar
      > ~46-60ms quando disparada durante um `login()` em andamento.
- [x] Código morto removido: `buscarUsuarioPorId` (nunca chamado) sai de
      `api/data/usuariosStore.js`.

## Testes — API

- [x] `npm test` da API não deixa linhas residuais em
      `api/data/personagens.db` — os testes de auth rodam contra um banco
      isolado (arquivo temporário ou `:memory:`) e/ou limpam o que inseriram.

## Front-end

- [x] O `try/catch` do submit em `PaginaCadastro.jsx` e `PaginaLogin.jsx`
      cobre só a chamada da mutation; falha em `entrar()`/`navigate()` depois
      do sucesso não fica silenciosa (aparece algum feedback, nem que seja um
      log visível/estado de erro).
- [x] Login/logout em uma aba reflete nas outras abas abertas (listener do
      evento `storage` sincroniza o estado de sessão entre abas).
- [x] `entrar()` e `sair()` limpam o cache do Apollo Client
      (`resetStore`/`clearStore`), pra não vazar dado de um usuário pro
      próximo que logar na mesma aba.
- [x] `useAutenticacao()` lança erro claro e explícito ("useAutenticacao deve
      ser usado dentro de ProvedorAutenticacao") quando chamado fora do
      provider, em vez de estourar `TypeError` opaco.
- [x] Formulários de cadastro e login compartilham um componente/hook comum
      em vez de duplicar estado e JSX.

## Documentação

- [x] `docs/projeto/ambiente.md` reflete o estado atual: `JWT_SECRET`
      obrigatório na API (não é mais opcional) e contagem de testes correta
      da API e do web após as mudanças desta tarefa.
