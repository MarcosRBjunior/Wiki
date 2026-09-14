# Requisitos — Fotos reais dos personagens

Não está no board original do `projeto.md`. Branch: `feature/19-fotos-personagens`.

## Contexto

Hoje o campo `imagem` de `personagens.json` aponta para arquivos que nunca
existiram de fato com esses nomes/extensões — só `aang.jpg` e `katara.jpg`
eram reais; os outros 22 personagens sempre caíram no fallback gerado via
ui-avatars.com (ver `AvatarPersonagem.jsx`). Foram adicionadas fotos reais
dos 24 personagens em `web/public/personagens/*.jpeg`; falta apontar o
dataset pra elas.

## Requisitos

- [ ] Os 24 personagens em `personagens.json` têm o campo `imagem`
      apontando para um arquivo `.jpeg` que existe de fato em
      `web/public/personagens/`.
- [ ] Os 3 casos em que o nome do arquivo não bate com o nome do personagem
      são corrigidos: Ty Lee → `ty_lee.jpeg`, Combustion Man →
      `combustion.jpeg`, Jeong Jeong → `jeong.jpeg`.
- [ ] Com o banco local recriado a partir do JSON corrigido, a listagem
      (`/personagens`), a página de detalhe de qualquer personagem e o card
      de destaque do mural mostram a foto real — não mais o avatar gerado
      (ui-avatars.com) nem as iniciais.
- [ ] O fallback pra avatar gerado continua funcionando quando uma imagem
      falha ao carregar (não é removido, só deixa de ser o caminho comum).
- [ ] Os arquivos antigos `aang.jpg`/`katara.jpg` (substituídos por
      `aang.jpeg`/`katara.jpeg`) são removidos do controle de versão.
- [ ] `docs/projeto/arquitetura.md` deixa de afirmar que só Aang e Katara
      têm arte própria.

## Fora de escopo (v1)

- Otimização/compressão das imagens (tamanho de arquivo, formato
  WebP/AVIF, srcset responsivo) — entra como melhoria futura se o
  carregamento da listagem ficar perceptivelmente lento.
