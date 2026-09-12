import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';
import { seedSeNecessario, listarPersonagens } from '../data/personagensStore.js';
import { buscarUsuarioPorEmail } from '../data/usuariosStore.js';

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

const CRIAR_CONTA = `
  mutation($email: String!, $senha: String!) {
    criarConta(email: $email, senha: $senha) { token usuario { id email } }
  }
`;

const LOGIN = `
  mutation($email: String!, $senha: String!) {
    login(email: $email, senha: $senha) { token usuario { id email } }
  }
`;

test('criarConta cria usuário e retorna token', async () => {
  const email = `${crypto.randomUUID()}@teste.com`;

  const response = await server.executeOperation({
    query: CRIAR_CONTA,
    variables: { email, senha: 'senha-valida-123' },
  });

  assert.equal(response.body.kind, 'single');
  assert.equal(response.body.singleResult.errors, undefined);
  const { token, usuario } = response.body.singleResult.data.criarConta;
  assert.ok(token);
  assert.equal(usuario.email, email);
});

test('criarConta rejeita senha menor que 8 caracteres', async () => {
  const email = `${crypto.randomUUID()}@teste.com`;

  const response = await server.executeOperation({
    query: CRIAR_CONTA,
    variables: { email, senha: '1234567' },
  });

  assert.equal(response.body.kind, 'single');
  assert.equal(response.body.singleResult.data, null);
  assert.equal(response.body.singleResult.errors[0].extensions.code, 'SENHA_INVALIDA');
  assert.equal(buscarUsuarioPorEmail(email), null);
});

test('criarConta rejeita e-mail já cadastrado', async () => {
  const email = `${crypto.randomUUID()}@teste.com`;

  await server.executeOperation({
    query: CRIAR_CONTA,
    variables: { email, senha: 'senha-valida-123' },
  });
  const response = await server.executeOperation({
    query: CRIAR_CONTA,
    variables: { email, senha: 'outra-senha-123' },
  });

  assert.equal(response.body.kind, 'single');
  assert.equal(response.body.singleResult.data, null);
  assert.equal(response.body.singleResult.errors[0].extensions.code, 'EMAIL_JA_CADASTRADO');
});

test('login autentica com credenciais corretas', async () => {
  const email = `${crypto.randomUUID()}@teste.com`;
  const senha = 'senha-valida-123';

  await server.executeOperation({ query: CRIAR_CONTA, variables: { email, senha } });
  const response = await server.executeOperation({ query: LOGIN, variables: { email, senha } });

  assert.equal(response.body.kind, 'single');
  assert.equal(response.body.singleResult.errors, undefined);
  assert.equal(response.body.singleResult.data.login.usuario.email, email);
});

test('login rejeita senha errada', async () => {
  const email = `${crypto.randomUUID()}@teste.com`;

  await server.executeOperation({
    query: CRIAR_CONTA,
    variables: { email, senha: 'senha-valida-123' },
  });
  const response = await server.executeOperation({
    query: LOGIN,
    variables: { email, senha: 'senha-errada-000' },
  });

  assert.equal(response.body.kind, 'single');
  assert.equal(response.body.singleResult.data, null);
  assert.equal(response.body.singleResult.errors[0].extensions.code, 'CREDENCIAIS_INVALIDAS');
});
