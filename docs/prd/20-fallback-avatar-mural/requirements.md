# Requisitos — Fallback de avatar desalinhado no mural

Não está no board original do `projeto.md`. Branch: `fix/20-fallback-avatar-mural`.

## Contexto

Achado durante a validação da tarefa 19 (`docs/prd/19-fotos-personagens/`),
mas é um bug pré-existente, sem relação com aquela tarefa: `AvatarPersonagem`
tem 3 níveis de fallback (foto real → avatar gerado via ui-avatars.com →
`<div>` com a inicial do nome). O terceiro nível reusa a mesma `className`
recebida via prop pra estilizar o `<div>` das iniciais.

`.personagem-card__avatar` (`web/src/index.css`, listagem) e
`.personagem-detalhe__avatar` (detalhe) já têm `display: flex`,
`align-items: center`, `justify-content: center`, gradiente de fundo e
fonte — cobrindo tanto o `<img>` quanto o `<div>` de iniciais.
`.mural__destaque-avatar` (usado só no card de destaque do mural) não tem
nenhuma dessas regras: hoje só estiliza o caso de `<img>` (tamanho, borda,
`object-fit`). Quando cai no terceiro nível de fallback, a letra aparece sem
centralizar, no canto superior esquerdo do círculo, sem o fundo em
gradiente.

## Requisitos

- [ ] Quando `AvatarPersonagem` cai no fallback de iniciais (`<div>`) dentro
      do card de destaque do mural, a letra aparece centralizada dentro do
      círculo, com o mesmo tratamento visual (gradiente de fundo, cor,
      tamanho de fonte proporcional aos 108px do avatar do mural) que já
      existe pra listagem e detalhe.
- [ ] O caso de `<img>` (foto real ou avatar gerado) no mural continua
      exatamente como está hoje — nenhuma regressão visual no card de
      destaque quando a imagem carrega normalmente.
- [ ] A correção fica isolada em `web/src/index.css`
      (`.mural__destaque-avatar`); nenhuma mudança em
      `AvatarPersonagem.jsx` é necessária pra este bug.

## Fora de escopo

- Revisitar o design dos outros dois níveis de fallback (listagem, detalhe)
  — já funcionam corretamente, não fazem parte deste bug.
