# Test Plan — Fotos reais dos personagens

Validado por uma sessão separada de QA, sem contexto da implementação. UI via
navegador real (Claude in Chrome), backend via request real contra o
servidor GraphQL rodando — nunca CLI, request direto sem servidor real ou
script mockado. Cada item marcado só com prova anexada.

- [ ] **Listagem mostra fotos reais**: acessar `/personagens` e conferir que
      os personagens cujo nome de arquivo não batia com o nome do dataset
      (Ty Lee, Combustion Man, Jeong Jeong) e mais alguns outros (ex: Aang,
      Zuko, Toph) mostram a foto real, não o avatar gerado (cores sólidas
      com iniciais) nem o círculo de iniciais.
- [ ] **Detalhe mostra foto real**: abrir `/personagens/:id` de um
      personagem qualquer e confirmar a mesma foto real, no tamanho maior
      do avatar de detalhe.
- [ ] **Mural mostra foto real do destaque**: acessar a landing page (`/`)
      e confirmar que o card de destaque (Zuko) mostra a foto real.
- [ ] **API expõe o campo `imagem` correto**: com o servidor GraphQL
      rodando, request real (`personagens { id nome imagem }`) e conferir
      que os 24 registros retornam um caminho `.jpeg` existente em
      `web/public/personagens/`, incluindo os 3 nomes corrigidos.
- [ ] **Fallback continua funcionando**: forçar um erro de carregamento de
      imagem (ex: via devtools, bloquear a request de uma foto) e confirmar
      que cai pro avatar gerado (ui-avatars.com) e depois pras iniciais, sem
      quebrar o layout.
- [ ] **Sem regressão no restante da página**: navegação, cards e layout da
      listagem/detalhe/mural continuam funcionando normalmente com as fotos
      reais (nenhum overflow, imagem esticada ou quebrada).

## Evidência

_(preenchida pela sessão de validação, não pela implementação)_
