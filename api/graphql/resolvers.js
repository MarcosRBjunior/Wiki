import { listarPersonagens } from '../data/personagensStore.js';

export const resolvers = {
  Query: {
    status: () => 'ok',
    personagens: () => listarPersonagens(),
  },
};
