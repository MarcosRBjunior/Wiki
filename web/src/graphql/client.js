import { ApolloClient, InMemoryCache } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'
import { SetContextLink } from '@apollo/client/link/context'
import { lerSessaoSalva } from '../utils/autenticacao.js'

const authLink = new SetContextLink(() => {
  const token = lerSessaoSalva()?.token
  return token ? { headers: { authorization: `Bearer ${token}` } } : {}
})

const httpLink = new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/' })

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
