# Requisitos — Cadastro e login local

Não está no board original do `projeto.md` (Níveis 1-3 já concluídos); extensão
proposta e aprovada durante sessão de planejamento (trocando a ideia inicial de
"login com Google" por conta local). Branch: `feature/16-cadastro-login`.
Depende dela: tarefa 17 (favoritar personagens).

## Contexto

Hoje o wiki não tem conta de usuário nem `Mutation` no schema (API é
somente-leitura por decisão explícita, `arquitetura.md`). O único propósito
desta conta é permitir favoritar personagens (tarefa 17) — não há área
administrativa nem edição de conteúdo do wiki envolvida.

## Requisitos

- [ ] Existe uma página de cadastro (rota `/cadastro`) com campos e-mail e
      senha, acessível por um link no Cabeçalho.
- [ ] Criar conta com e-mail novo e senha válida (mínimo 8 caracteres) cria o
      usuário e já inicia a sessão (login automático), sem precisar logar de
      novo.
- [ ] Tentar criar conta com um e-mail já cadastrado mostra mensagem de erro
      clara na tela, sem criar duplicata no banco.
- [ ] Existe uma página de login (rota `/login`) com campos e-mail e senha,
      acessível por um link no Cabeçalho.
- [ ] Login com e-mail e senha corretos autentica o usuário e redireciona
      para o mural (`/`).
- [ ] Login com e-mail inexistente ou senha errada mostra mensagem de erro
      genérica ("e-mail ou senha inválidos"), sem indicar qual dos dois
      campos está errado.
- [ ] Estando autenticado, o Cabeçalho mostra o e-mail do usuário e um botão
      "Sair", no lugar dos links de Login/Criar conta.
- [ ] Clicar em "Sair" encerra a sessão imediatamente; o Cabeçalho volta a
      mostrar os links de Login/Criar conta.
- [ ] A sessão persiste entre recarregamentos de página (F5) até logout
      explícito ou expiração do token.
- [ ] A senha nunca é armazenada em texto puro no banco (hash com salt).
- [ ] Os formulários de cadastro e login são navegáveis e utilizáveis
      inteiramente por teclado, com `label` associado a cada campo.
