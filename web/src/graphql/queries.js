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
