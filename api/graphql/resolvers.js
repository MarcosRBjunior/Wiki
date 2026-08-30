import { listarPersonagens, buscarPersonagemPorId } from '../data/personagensStore.js';

export const resolvers = {
  Query: {
    status: () => 'ok',
    personagens: () => listarPersonagens(),
    personagem: (_, { id }) => buscarPersonagemPorId(id),
  },
};
