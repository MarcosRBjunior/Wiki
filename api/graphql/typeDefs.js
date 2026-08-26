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

  type Query {
    status: String!
    personagens: [Personagem!]!
  }
`;
