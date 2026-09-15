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

test('criarConta rejeita e-mail vazio', async () => {
  const response = await server.executeOperation({
    query: CRIAR_CONTA,
    variables: { email: '', senha: 'senha-valida-123' },
  });

  assert.equal(response.body.kind, 'single');
  assert.equal(response.body.singleResult.data, null);
  assert.equal(response.body.singleResult.errors[0].extensions.code, 'EMAIL_INVALIDO');
  assert.equal(buscarUsuarioPorEmail(''), null);
});

test('criarConta rejeita e-mail sem formato válido', async () => {
  const response = await server.executeOperation({
    query: CRIAR_CONTA,
    variables: { email: 'nao-e-email', senha: 'senha-valida-123' },
  });

  assert.equal(response.body.kind, 'single');
  assert.equal(response.body.singleResult.data, null);
  assert.equal(response.body.singleResult.errors[0].extensions.code, 'EMAIL_INVALIDO');
});

const FAVORITAR = `
  mutation($personagemId: ID!) {
    favoritar(personagemId: $personagemId) { id favoritado }
  }
`;

const DESFAVORITAR = `
  mutation($personagemId: ID!) {
    desfavoritar(personagemId: $personagemId) { id favoritado }
  }
`;

const MEUS_FAVORITOS = `
  query { meusFavoritos { id nome } }
`;

async function criarUsuarioAutenticado() {
  const email = `${crypto.randomUUID()}@teste.com`;
  const response = await server.executeOperation({
    query: CRIAR_CONTA,
    variables: { email, senha: 'senha-valida-123' },
  });
  return response.body.singleResult.data.criarConta.usuario.id;
}

test('favoritar exige autenticação', async () => {
  const [personagem] = listarPersonagens();

  const response = await server.executeOperation(
    { query: FAVORITAR, variables: { personagemId: personagem.id } },
    { contextValue: { usuarioId: null } },
  );

  assert.equal(response.body.singleResult.data, null);
  assert.equal(response.body.singleResult.errors[0].extensions.code, 'NAO_AUTENTICADO');
});

test('favoritar marca o personagem como favorito e passa a refletir em personagem(id)', async () => {
  const usuarioId = await criarUsuarioAutenticado();
  const [personagem] = listarPersonagens();

  const resposta = await server.executeOperation(
    { query: FAVORITAR, variables: { personagemId: personagem.id } },
    { contextValue: { usuarioId } },
  );
  assert.equal(resposta.body.singleResult.errors, undefined);
  assert.equal(resposta.body.singleResult.data.favoritar.favoritado, true);

  const consulta = await server.executeOperation(
    { query: 'query($id: ID!) { personagem(id: $id) { favoritado } }', variables: { id: personagem.id } },
    { contextValue: { usuarioId } },
  );
  assert.equal(consulta.body.singleResult.data.personagem.favoritado, true);
});

test('favoritar rejeita personagem inexistente', async () => {
  const usuarioId = await criarUsuarioAutenticado();

  const response = await server.executeOperation(
    { query: FAVORITAR, variables: { personagemId: 'id-que-nao-existe' } },
    { contextValue: { usuarioId } },
  );

  assert.equal(response.body.singleResult.data, null);
  assert.equal(response.body.singleResult.errors[0].extensions.code, 'PERSONAGEM_NAO_ENCONTRADO');
});

test('desfavoritar reverte o estado de favorito', async () => {
  const usuarioId = await criarUsuarioAutenticado();
  const [personagem] = listarPersonagens();

  await server.executeOperation(
    { query: FAVORITAR, variables: { personagemId: personagem.id } },
    { contextValue: { usuarioId } },
  );
  const resposta = await server.executeOperation(
    { query: DESFAVORITAR, variables: { personagemId: personagem.id } },
    { contextValue: { usuarioId } },
  );

  assert.equal(resposta.body.singleResult.errors, undefined);
  assert.equal(resposta.body.singleResult.data.desfavoritar.favoritado, false);
});

test('meusFavoritos exige autenticação', async () => {
  const response = await server.executeOperation(
    { query: MEUS_FAVORITOS },
    { contextValue: { usuarioId: null } },
  );

  assert.equal(response.body.singleResult.data, null);
  assert.equal(response.body.singleResult.errors[0].extensions.code, 'NAO_AUTENTICADO');
});

test('meusFavoritos lista só os personagens favoritados pelo usuário logado', async () => {
  const usuarioA = await criarUsuarioAutenticado();
  const usuarioB = await criarUsuarioAutenticado();
  const [primeiro, segundo] = listarPersonagens();

  await server.executeOperation(
    { query: FAVORITAR, variables: { personagemId: primeiro.id } },
    { contextValue: { usuarioId: usuarioA } },
  );
  await server.executeOperation(
    { query: FAVORITAR, variables: { personagemId: segundo.id } },
    { contextValue: { usuarioId: usuarioB } },
  );

  const respostaA = await server.executeOperation(
    { query: MEUS_FAVORITOS },
    { contextValue: { usuarioId: usuarioA } },
  );
  const idsA = respostaA.body.singleResult.data.meusFavoritos.map((p) => p.id);
  assert.deepEqual(idsA, [primeiro.id]);

  const respostaB = await server.executeOperation(
    { query: MEUS_FAVORITOS },
    { contextValue: { usuarioId: usuarioB } },
  );
  const idsB = respostaB.body.singleResult.data.meusFavoritos.map((p) => p.id);
  assert.deepEqual(idsB, [segundo.id]);
});

test('cadastro e login não diferenciam maiúsculas/minúsculas no e-mail', async () => {
  const email = `CaseTeste-${crypto.randomUUID()}@Teste.com`;
  const senha = 'senha-valida-123';

  await server.executeOperation({ query: CRIAR_CONTA, variables: { email, senha } });

  const duplicata = await server.executeOperation({
    query: CRIAR_CONTA,
    variables: { email: email.toLowerCase(), senha },
  });
  assert.equal(duplicata.body.singleResult.errors[0].extensions.code, 'EMAIL_JA_CADASTRADO');

  const login = await server.executeOperation({
    query: LOGIN,
    variables: { email: email.toUpperCase(), senha },
  });
  assert.equal(login.body.singleResult.errors, undefined);
  assert.equal(login.body.singleResult.data.login.usuario.email, email.toLowerCase());
});
