# Requisitos — Correções da revisão de código (cadastro/login, tarefa 16)

Origem: `/code-review` rodado sobre o commit `90a1458` (PR #20, tarefa 16 —
cadastro/login). 14 dos 15 achados viram requisito de código aqui. O 15º
achado (checks do test-plan da tarefa 16 marcados pelo próprio implementador,
violando a regra 3 do `CLAUDE.md`) não é corrigível retroativamente — não
gera requisito, só reforça que esta tarefa precisa de validação em sessão
separada de verdade.

Branch: `fix/18-correcoes-revisao-login`.

## Segurança / correção — API

- [ ] Cadastro e login tratam e-mail sem diferenciar maiúsculas/minúsculas
      (normalizado antes de salvar e antes de buscar), então
      `User@Ex.com` e `user@ex.com` são o mesmo usuário — sem duplicata, sem
      lockout.
- [ ] `login()` não vaza, por tempo de resposta, se um e-mail existe ou não:
      o tempo de resposta para e-mail inexistente é comparável ao de senha
      errada (roda uma comparação bcrypt mesmo quando o usuário não existe).
- [ ] `criarConta` rejeita e-mail vazio ou em formato inválido com o mesmo
      `GraphQLError` amigável usado pros outros casos de validação — não cria
      conta com `email: ""`.
- [ ] `criarConta` trata violação da constraint `UNIQUE` do banco (não só o
      `SELECT` prévio) devolvendo o erro amigável "E-mail já cadastrado.",
      não um erro cru do SQLite.
- [ ] `jwt.verify` (em `api/autenticacao.js`) fixa `algorithms: ['HS256']`
      explicitamente, e `jwt.sign` idem.
- [ ] Hash e verificação de senha (`bcrypt`) não bloqueiam o event loop —
      usam a API assíncrona do `bcryptjs`.
- [ ] Código morto removido: `buscarUsuarioPorId` (nunca chamado) sai de
      `api/data/usuariosStore.js`.

## Testes — API

- [ ] `npm test` da API não deixa linhas residuais em
      `api/data/personagens.db` — os testes de auth rodam contra um banco
      isolado (arquivo temporário ou `:memory:`) e/ou limpam o que inseriram.

## Front-end

- [ ] O `try/catch` do submit em `PaginaCadastro.jsx` e `PaginaLogin.jsx`
      cobre só a chamada da mutation; falha em `entrar()`/`navigate()` depois
      do sucesso não fica silenciosa (aparece algum feedback, nem que seja um
      log visível/estado de erro).
- [ ] Login/logout em uma aba reflete nas outras abas abertas (listener do
      evento `storage` sincroniza o estado de sessão entre abas).
- [ ] `entrar()` e `sair()` limpam o cache do Apollo Client
      (`resetStore`/`clearStore`), pra não vazar dado de um usuário pro
      próximo que logar na mesma aba.
- [ ] `useAutenticacao()` lança erro claro e explícito ("useAutenticacao deve
      ser usado dentro de ProvedorAutenticacao") quando chamado fora do
      provider, em vez de estourar `TypeError` opaco.
- [ ] Formulários de cadastro e login compartilham um componente/hook comum
      em vez de duplicar estado e JSX.

## Documentação

- [ ] `docs/projeto/ambiente.md` reflete o estado atual: `JWT_SECRET`
      obrigatório na API (não é mais opcional) e contagem de testes correta
      da API e do web após as mudanças desta tarefa.
