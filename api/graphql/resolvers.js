import { GraphQLError } from 'graphql';
import { listarPersonagens, buscarPersonagemPorId } from '../data/personagensStore.js';
import { buscarUsuarioPorEmail, criarUsuario, verificarSenha } from '../data/usuariosStore.js';
import {
  estaFavoritado,
  marcarFavorito,
  desmarcarFavorito,
  listarFavoritos,
} from '../data/favoritosStore.js';
import { assinarToken } from '../autenticacao.js';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function erroEmailJaCadastrado() {
  return new GraphQLError('E-mail já cadastrado.', {
    extensions: { code: 'EMAIL_JA_CADASTRADO' },
  });
}

function exigirAutenticacao(context) {
  if (!context.usuarioId) {
    throw new GraphQLError('É preciso estar autenticado.', {
      extensions: { code: 'NAO_AUTENTICADO' },
    });
  }
}

function exigirPersonagemExistente(personagemId) {
  const personagem = buscarPersonagemPorId(personagemId);
  if (!personagem) {
    throw new GraphQLError('Personagem não encontrado.', {
      extensions: { code: 'PERSONAGEM_NAO_ENCONTRADO' },
    });
  }
  return personagem;
}

export const resolvers = {
  Personagem: {
    favoritado: (personagem, _args, context) =>
      context.usuarioId ? estaFavoritado(context.usuarioId, personagem.id) : false,
  },
  Query: {
    status: () => 'ok',
    personagens: () => listarPersonagens(),
    personagem: (_, { id }) => buscarPersonagemPorId(id),
    meusFavoritos: (_, __, context) => {
      exigirAutenticacao(context);
      return listarFavoritos(context.usuarioId);
    },
  },
  Mutation: {
    criarConta: async (_, { email, senha }) => {
      if (!EMAIL_VALIDO.test(email ?? '')) {
        throw new GraphQLError('E-mail inválido.', {
          extensions: { code: 'EMAIL_INVALIDO' },
        });
      }

      if (senha.length < 8) {
        throw new GraphQLError('Senha precisa ter no mínimo 8 caracteres.', {
          extensions: { code: 'SENHA_INVALIDA' },
        });
      }

      if (buscarUsuarioPorEmail(email)) {
        throw erroEmailJaCadastrado();
      }

      try {
        const usuario = await criarUsuario({ email, senha });
        return { token: assinarToken(usuario.id), usuario };
      } catch (erro) {
        if (typeof erro.code === 'string' && erro.code.startsWith('SQLITE_CONSTRAINT')) {
          throw erroEmailJaCadastrado();
        }
        throw erro;
      }
    },
    login: async (_, { email, senha }) => {
      const usuario = buscarUsuarioPorEmail(email);
      const senhaCorreta = await verificarSenha(usuario, senha);
      if (!usuario || !senhaCorreta) {
        throw new GraphQLError('E-mail ou senha inválidos.', {
          extensions: { code: 'CREDENCIAIS_INVALIDAS' },
        });
      }

      return { token: assinarToken(usuario.id), usuario };
    },
    favoritar: (_, { personagemId }, context) => {
      exigirAutenticacao(context);
      const personagem = exigirPersonagemExistente(personagemId);
      marcarFavorito(context.usuarioId, personagemId);
      return personagem;
    },
    desfavoritar: (_, { personagemId }, context) => {
      exigirAutenticacao(context);
      const personagem = exigirPersonagemExistente(personagemId);
      desmarcarFavorito(context.usuarioId, personagemId);
      return personagem;
    },
  },
};
