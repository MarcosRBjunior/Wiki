import { gql } from '@apollo/client'

export const PERSONAGENS_QUERY = gql`
  query Personagens {
    personagens {
      id
      nome
      nacao
      imagem
    }
  }
`

export const PERSONAGEM_QUERY = gql`
  query Personagem($id: ID!) {
    personagem(id: $id) {
      id
      nome
      nacao
      idade
      historia
      sonhos
      imagem
      favoritado
    }
  }
`

export const MEUS_FAVORITOS_QUERY = gql`
  query MeusFavoritos {
    meusFavoritos {
      id
      nome
      nacao
      imagem
    }
  }
`

export const FAVORITAR_MUTATION = gql`
  mutation Favoritar($personagemId: ID!) {
    favoritar(personagemId: $personagemId) {
      id
      favoritado
    }
  }
`

export const DESFAVORITAR_MUTATION = gql`
  mutation Desfavoritar($personagemId: ID!) {
    desfavoritar(personagemId: $personagemId) {
      id
      favoritado
    }
  }
`

export const CRIAR_CONTA_MUTATION = gql`
  mutation CriarConta($email: String!, $senha: String!) {
    criarConta(email: $email, senha: $senha) {
      token
      usuario {
        id
        email
      }
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $senha: String!) {
    login(email: $email, senha: $senha) {
      token
      usuario {
        id
        email
      }
    }
  }
`
