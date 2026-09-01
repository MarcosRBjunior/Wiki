import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';
import { seedSeNecessario, listarPersonagens } from '../data/personagensStore.js';

const server = new ApolloServer({ typeDefs, resolvers });

before(async () => {
  await seedSeNecessario();
});

test('personagem(id) retorna o personagem correspondente', async () => {
  const [primeiro] = listarPersonagens();

  const response = await server.executeOperation({
    query: 'query($id: ID!) { personagem(id: $id) { id nome nacao idade historia sonhos imagem } }',
    variables: { id: primeiro.id },
  });

  assert.equal(response.body.kind, 'single');
  assert.deepEqual({ ...response.body.singleResult.data.personagem }, { ...primeiro });
});

test('personagem(id) retorna null para id inexistente', async () => {
  const response = await server.executeOperation({
    query: 'query($id: ID!) { personagem(id: $id) { id } }',
    variables: { id: 'id-que-nao-existe' },
  });

  assert.equal(response.body.kind, 'single');
  assert.equal(response.body.singleResult.data.personagem, null);
  assert.equal(response.body.singleResult.errors, undefined);
});

test('personagens retorna a lista completa', async () => {
  const response = await server.executeOperation({
    query: 'query { personagens { id nome } }',
  });

  assert.equal(response.body.kind, 'single');
  assert.ok(response.body.singleResult.data.personagens.length > 0);
});
