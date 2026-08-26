# Fonte de dados dos personagens

Universo escolhido: **Avatar: A Lenda de Aang**.

**Fonte:** dataset estático (`personagens.json`), curado manualmente. Não
usamos uma API pública externa porque os campos exigidos pelo projeto
(`sonhos`, por exemplo) não existem em APIs prontas sobre o universo — teria
sido necessário complementar os dados de qualquer fonte externa de qualquer
forma.

Este arquivo é a fonte "crua" que a task 3 vai ler/buscar e a task 4 vai
persistir no banco de dados. A estrutura de cada personagem:

```json
{
  "id": "string",
  "nome": "string",
  "nacao": "string",
  "idade": "number",
  "historia": "string",
  "sonhos": "string",
  "imagem": "string (caminho do asset no front-end)"
}
```
