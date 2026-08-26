import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { seedSeNecessario } from './data/personagensStore.js';

const PORT = process.env.PORT || 4000;

await seedSeNecessario();

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
});

console.log(`Apollo Server pronto em ${url}`);
