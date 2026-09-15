# Requisitos — Favoritar personagens

Não está no board original do `projeto.md`; depende da tarefa 16
(`docs/prd/16-cadastro-login/`, já mergeada em `develop`), que existe
justamente pra viabilizar esta. Branch: `feature/17-favoritar-personagens`.

## Contexto

Cadastro/login (tarefa 16) não protege nenhuma ação hoje — o único propósito
da conta é permitir favoritar personagens. Esta tarefa fecha esse ciclo.

## Requisitos

- [ ] Estando autenticado, a página de detalhe de um personagem
      (`/personagens/:id`) mostra um botão de favoritar (coração
      vazio/cheio).
- [ ] Clicar no botão, logado, marca aquele personagem como favorito e o
      ícone muda imediatamente pra refletir o novo estado, sem recarregar a
      página.
- [ ] Clicar de novo no mesmo botão desfavorita o personagem, revertendo o
      ícone.
- [ ] O estado de favorito persiste entre recarregamentos de página e entre
      sessões — fica salvo no banco associado ao usuário, não é um estado só
      do navegador.
- [ ] Sem estar autenticado, a página de detalhe não mostra o botão de
      favoritar (decidir na implementação: ocultar vs. mostrar
      desabilitado/convidando a logar).
- [ ] Existe uma página "Meus favoritos" (`/favoritos`) que lista todos os
      personagens favoritados pelo usuário logado, reaproveitando o card já
      usado na listagem principal.
- [ ] Acessar `/favoritos` sem estar logado redireciona pra `/login` (ou
      mostra uma mensagem clara pedindo login, em vez de tela vazia/erro).
- [ ] O botão de favoritar é utilizável por teclado e tem `aria-label`
      descrevendo a ação do próximo clique (ex: "Adicionar aos favoritos" /
      "Remover dos favoritos").
- [ ] Favoritos são por conta: favoritar um personagem numa conta não afeta
      o estado desse personagem pra nenhuma outra conta.

## Fora de escopo (v1)

- Botão de favoritar na listagem (`/personagens`): o card ali já é um link
  inteiro (`MotionLink`); embutir um botão clicável dentro de um link é
  elemento interativo aninhado (problema de a11y/HTML). Só entra na página
  de detalhe por enquanto.
