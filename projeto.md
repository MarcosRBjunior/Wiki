# Wiki para Fãs — Projeto 02 (Boost Program, Nível Básico)

Documento de referência do projeto: estrutura de repositório, estratégia de
branches, organização das tasks e fluxo prático de trabalho. Leia isso antes
de abrir qualquer branch ou PR.

## 1. Sobre o projeto

Criar um **wiki de fãs** que lista os personagens de um seriado, filme ou
desenho favorito, com páginas dinâmicas de detalhe (história, idade, sonhos)
e uma identidade visual personalizada baseada no universo escolhido.

**Tech stack definida:**
- Back-end: **Node.js** + **GraphQL** (Apollo Server) — API única desde o início,
  sem passar por REST.
- Front-end: **React** + **React Router** + **Apollo Client**
- Estilo/animação: **Framer Motion** ou **React Spring**

> Decisão de projeto: GraphQL foi escolhido desde o Nível 1 (não como migração
> posterior) porque já há experiência prévia da equipe com a stack.

## 2. Estrutura de repositório

Monorepo com back-end e front-end desacoplados em pastas semânticas, para que
possam ser desenvolvidos e revisados de forma independente:

```
wiki-fans/
├── api/                    → Back-end (Node.js + GraphQL)
│   ├── graphql/
│   │   ├── typeDefs.js     → Schema (tipos, queries, mutations)
│   │   └── resolvers.js    → Lógica de resolução das queries/mutations
│   ├── data/                → Acesso a dados / models do banco
│   └── index.js             → Setup do Apollo Server
│
├── web/                    → Front-end (React)
│   ├── src/
│   │   ├── pages/            → Listagem e Detalhe do personagem
│   │   ├── components/       → Componentes reutilizáveis (cards, layout)
│   │   └── graphql/           → Queries/mutations usadas pelo Apollo Client
│   └── ...
│
└── docs/                   → Documentação do projeto (este arquivo)
```

**Regra geral:** o back-end só cuida de buscar, armazenar e expor dados via
GraphQL. O front-end só cuida de exibir dados e interação com o usuário.
Nenhum dos dois deve conter lógica do outro.

## 3. Estratégia de branches

```
main        → versão estável, pronta para entrega/deploy
develop     → integração das features antes de ir para main
feature/*   → uma branch por task (issue)
fix/*       → correção de bugs
```

### Convenção de nomes

Sempre no formato `feature/<numero-da-issue>-<descricao-curta>`:

```
feature/5-schema-graphql-setup
feature/10-pagina-detalhe-personagem
fix/13-erro-estilo-mobile
```

### Regra de ouro

**Uma branch = uma tarefa.** Nunca resolva duas issues na mesma branch — é o
que evita que uma tarefa "atrapalhe" a outra e mantém os PRs pequenos e
fáceis de revisar.

## 4. Organização das tasks (Project Board)

As tasks estão organizadas em 3 milestones, seguindo os níveis do projeto.
Dentro de cada nível, back-end e front-end são tratados como trilhas
paralelas (não bloqueiam uma à outra além do necessário).

### 🟣 Nível 1 — API GraphQL + listagem básica

| # | Task | Área | Branch |
|---|---|---|---|
| 1 | Setup do projeto Node.js (`api/`) | Back-end | `feature/1-setup-node-api` |
| 2 | Escolher/criar fonte de dados dos personagens | Back-end | `feature/2-fonte-dados-personagens` |
| 3 | Buscar dados dos personagens | Back-end | `feature/3-fetch-personagens` |
| 4 | Armazenar dados em banco de dados | Back-end | `feature/4-armazenar-dados-db` |
| 5 | Definir schema GraphQL + setup Apollo Server | Back-end | `feature/5-schema-graphql-setup` |
| 5b | Criar query `personagens` (listagem) | Back-end | `feature/5b-query-listagem` |
| 6 | Setup do projeto React (`web/`) | Front-end | `feature/6-setup-react-app` |
| 6b | Configurar Apollo Client no front | Front-end | `feature/6b-setup-graphql-client` |
| 7 | Tela de listagem consumindo a query GraphQL | Front-end | `feature/7-grid-listagem-personagens` |

### 🟣 Nível 2 — Páginas dinâmicas

| # | Task | Área | Branch |
|---|---|---|---|
| 8 | Query `personagem(id)` (detalhe) | Back-end | `feature/8-query-detalhe-personagem` |
| 9 | Instalar e configurar React Router | Front-end | `feature/9-setup-react-router` |
| 10 | Página dinâmica de detalhe (história, idade, sonhos) | Front-end | `feature/10-pagina-detalhe-personagem` |
| 11 | Navegação clicável da listagem → detalhe | Front-end | `feature/11-navegacao-listagem-detalhe` |

### 🟣 Nível 3 — Estilo e personalização

| # | Task | Área | Branch |
|---|---|---|---|
| 12 | Definir identidade visual baseada no universo escolhido | Front-end | `feature/12-identidade-visual-tema` |
| 13 | Estilização customizada | Front-end | `feature/13-estilos-personalizados` |
| 14 | Animações com Framer Motion ou React Spring | Front-end | `feature/14-animacoes-transicoes` |

### Colunas do board

```
Backlog → Em andamento → Em revisão → Concluído
```

## 5. Dependências entre tasks

Para evitar que uma task trave outra sem necessidade:

- **Dentro do mesmo nível**, back-end e front-end podem andar em paralelo,
  desde que o front não dependa de um endpoint que ainda não existe (ex: a
  task 7 depende do schema/query da task 5 e 5b estarem prontos).
- **Entre níveis**, sempre feche o nível anterior antes de avançar: não faça
  sentido estilizar (Nível 3) uma tela que ainda vai ganhar navegação
  (Nível 2).
- **Setup sempre primeiro e sozinho**: as tasks 1 e 6 (setup de projeto) não
  devem rodar em paralelo com nenhuma outra, já que tudo depende delas
  existirem primeiro.

## 6. Fluxo prático por task

1. **Pegar a issue** no board e mover para "Em andamento".
2. **Atualizar a base local:**
   ```bash
   git checkout develop
   git pull
   ```
3. **Criar a branch** a partir da `develop` atualizada:
   ```bash
   git checkout -b feature/numero-descricao
   ```
4. **Commits pequenos e descritivos**, seguindo Conventional Commits:
   ```bash
   git commit -m "feat(api): cria schema graphql do personagem"
   git commit -m "fix(web): corrige estilo do card na listagem"
   ```
5. **Manter a branch atualizada** durante o desenvolvimento, se ela durar
   mais de um dia:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```
6. **Abrir Pull Request** para `develop`, linkando a issue na descrição:
   ```
   Closes #5
   ```
7. **Revisão** (mesmo que solo, revise o diff completo antes do merge).
8. **Merge** (preferencialmente squash, para manter o histórico limpo) e
   **deletar a branch** em seguida.
9. Mover o card da issue para "Concluído".
10. Quando `develop` estiver estável e todas as tasks do nível estiverem
    fechadas, mergear `develop` em `main`.

## 7. Checklist antes de abrir um PR

- [ ] A branch resolve **apenas uma** issue.
- [ ] Não há código do front dentro de `api/` nem vice-versa.
- [ ] O PR está linkado à issue correspondente.
- [ ] A branch está atualizada com `develop` (sem conflitos pendentes).
- [ ] Testado localmente (schema válido, tela renderizando, etc).
