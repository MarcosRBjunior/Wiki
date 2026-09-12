export const typeDefs = `#graphql
  type Personagem {
    id: ID!
    nome: String!
    nacao: String!
    idade: Int!
    historia: String!
    sonhos: String!
    imagem: String!
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
  }

  type Mutation {
    criarConta(email: String!, senha: String!): AutenticacaoPayload!
    login(email: String!, senha: String!): AutenticacaoPayload!
  }
`;
