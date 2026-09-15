export const typeDefs = `#graphql
  type Personagem {
    id: ID!
    nome: String!
    nacao: String!
    idade: Int!
    historia: String!
    sonhos: String!
    imagem: String!
    favoritado: Boolean!
  }

  type Usuario {
    id: ID!
    email: String!
  }

  type AutenticacaoPayload {
    token: String!
    usuario: Usuario!
  }

  type Query {
    status: String!
    personagens: [Personagem!]!
    personagem(id: ID!): Personagem
    meusFavoritos: [Personagem!]!
  }

  type Mutation {
    criarConta(email: String!, senha: String!): AutenticacaoPayload!
    login(email: String!, senha: String!): AutenticacaoPayload!
    favoritar(personagemId: ID!): Personagem!
    desfavoritar(personagemId: ID!): Personagem!
  }
`;
