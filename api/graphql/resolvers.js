import { GraphQLError } from 'graphql';
import { listarPersonagens, buscarPersonagemPorId } from '../data/personagensStore.js';
import { buscarUsuarioPorEmail, criarUsuario, verificarSenha } from '../data/usuariosStore.js';
import { assinarToken } from '../autenticacao.js';

export const resolvers = {
  Query: {
    status: () => 'ok',
    personagens: () => listarPersonagens(),
    personagem: (_, { id }) => buscarPersonagemPorId(id),
  },
  Mutation: {
    criarConta: (_, { email, senha }) => {
      if (senha.length < 8) {
        throw new GraphQLError('Senha precisa ter no mínimo 8 caracteres.', {
          extensions: { code: 'SENHA_INVALIDA' },
        });
      }

      if (buscarUsuarioPorEmail(email)) {
        throw new GraphQLError('E-mail já cadastrado.', {
          extensions: { code: 'EMAIL_JA_CADASTRADO' },
        });
      }

      const usuario = criarUsuario({ email, senha });
      return { token: assinarToken(usuario.id), usuario };
    },
    login: (_, { email, senha }) => {
      const usuario = buscarUsuarioPorEmail(email);
      const senhaCorreta = verificarSenha(usuario, senha);
      if (!usuario || !senhaCorreta) {
        throw new GraphQLError('E-mail ou senha inválidos.', {
          extensions: { code: 'CREDENCIAIS_INVALIDAS' },
        });
      }

      return { token: assinarToken(usuario.id), usuario };
    },
  },
};
