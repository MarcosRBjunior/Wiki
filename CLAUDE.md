# Wiki de Fãs — Avatar: A Lenda de Aang

Monorepo: `api/` (Node + GraphQL/Apollo Server, somente leitura) e `web/`
(React + Vite + Apollo Client). Escopo, board de tasks e estratégia de branch
completos: `projeto.md`, na raiz.

Documentação técnica:
- `docs/projeto/arquitetura.md` — o que é, camadas, decisões e porquês
- `docs/projeto/convencoes.md` — padrões de código
- `docs/projeto/ambiente.md` — comandos de install/dev/test/build testados

## Regras do fluxo de trabalho

Válido para toda funcionalidade nova ou correção de bug, a partir de agora.

1. **Requisitos primeiro.** Se não existir `docs/prd/<tarefa>/requirements.md`
   para a tarefa, criar antes de tocar em código. Cada requisito é um
   checkbox. `<tarefa>` é o número/nome do board em `projeto.md` quando
   existir um item correspondente.
2. **Test Plan junto.** Toda `requirements.md` vem acompanhada de
   `docs/prd/<tarefa>/test-plan.md`, também em checkboxes — um item de teste
   por comportamento esperado.
3. **Quem implementa nunca marca o próprio check.** Terminado cada item do
   Test Plan, abrir uma sessão de validação separada, sem o contexto da
   implementação, dedicada só a testar aquele item e marcar o check. Todo
   check exige prova real registrada junto (não "parece que funciona").
4. **Prova real, nunca mock.**
   - Web: abrir a página de verdade, clicar, navegar, conferir o resultado na
     tela (via o plugin de automação de navegador conectado nesta sessão).
     CLI, request direto ou script mockado **não contam como prova** para
     comportamento de interface.
   - API/backend: request real contra o servidor rodando, não teste unitário
     mockado.
   - Se o plugin de navegador falhar: registrar o comando que seria usado,
     avisar que a sessão precisa ser reiniciada, e retomar a validação depois
     — nunca substituir por mock só para não travar.
5. **Fechamento de sessão.** Quando for pedido "fecha a sessão", escrever os
   aprendizados em `docs/aprendizados/`, mostrar o conteúdo completo antes de
   salvar, e só gravar depois de aprovado.

## Branch e commit

Reforço rápido — regra completa em `projeto.md`. Toda tarefa em
`feature/<numero>-<slug>` ou `fix/<numero>-<slug>`, PR para `develop`, nunca
commit direto em `main`.
