import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { seedSeNecessario } from './data/personagensStore.js';
import { verificarToken } from './autenticacao.js';

const PORT = process.env.PORT || 4000;

await seedSeNecessario();

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async ({ req }) => {
    const cabecalho = req.headers.authorization ?? '';
    const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7) : null;
    return { usuarioId: token ? verificarToken(token) : null };
  },
});

console.log(`Apollo Server pronto em ${url}`);
