# Requisitos — Toggle de tema claro/escuro

Não está no board original do `projeto.md` (Níveis 1-3 já concluídos); extensão
proposta e aprovada durante a sessão de harness. Branch: `feature/15-toggle-tema`.

## Contexto

Hoje o dark mode só segue `prefers-color-scheme` do sistema operacional
(`web/src/index.css`), sem controle manual na interface. A ideia é dar ao
usuário um botão no Cabeçalho pra escolher o tema, sem quebrar o
comportamento automático de quem nunca mexeu nele.

## Requisitos

- [ ] Existe um botão visível no Cabeçalho, em todas as rotas, que alterna
      entre tema claro e escuro.
- [ ] Clicar no botão aplica o tema escolhido imediatamente em toda a
      aplicação (cores de fundo, texto, superfície — as mesmas variáveis que
      já mudam com `prefers-color-scheme`).
- [ ] A escolha do usuário persiste entre recarregamentos de página
      (`localStorage`).
- [ ] Enquanto o usuário nunca clicou no botão, o app continua respeitando
      `prefers-color-scheme` do SO — o comportamento atual não pode regredir.
- [ ] O botão indica visualmente e via texto acessível (`aria-label`) qual é
      a ação do próximo clique (ex: "Ativar tema escuro" quando o tema atual
      é claro).
- [ ] Funciona por teclado (é um `<button>` nativo, focável, ativável com
      Enter/Espaço).
