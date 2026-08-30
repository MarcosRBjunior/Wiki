import { gql } from '@apollo/client'

export const PERSONAGENS_QUERY = gql`
  query Personagens {
    personagens {
      id
      nome
      nacao
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
    }
  }
`
