# Test Plan — Fallback de avatar desalinhado no mural

Validado por uma sessão separada de QA, sem contexto da implementação. UI via
navegador real (Claude in Chrome) — nunca CLI, request direto ou script
mockado. Cada item marcado só com prova anexada.

- [ ] **Iniciais centralizadas no mural**: na landing page (`/`), forçar os
      dois primeiros níveis de fallback a falhar pro personagem de destaque
      (ex: via devtools/javascript, quebrar o `src` da foto real e do avatar
      gerado) e confirmar que a letra da inicial aparece centralizada dentro
      do círculo, com fundo em gradiente — igual ao mesmo fallback já
      visível na listagem (`/personagens`) ou detalhe (`/personagens/:id`).
- [ ] **Sem regressão no caso normal do mural**: com a foto real carregando
      normalmente (comportamento padrão, sem forçar erro), o card de
      destaque do mural continua exatamente igual a antes — mesmo tamanho,
      borda, `object-fit: cover`, sem gradiente de fundo aparecendo atrás da
      foto.
- [ ] **Sem regressão na listagem e no detalhe**: o fallback de iniciais
      (forçado da mesma forma) continua centralizado e estilizado
      corretamente nesses dois lugares, sem nenhuma mudança perceptível
      causada por esta correção.

## Evidência

_(preenchida pela sessão de validação, não pela implementação)_
