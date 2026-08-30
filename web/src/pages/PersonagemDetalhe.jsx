import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { PERSONAGEM_QUERY } from '../graphql/queries.js'

export function PersonagemDetalhe() {
  const { id } = useParams()
  const { data, loading, error } = useQuery(PERSONAGEM_QUERY, { variables: { id } })

  if (loading) return <p>Carregando personagem...</p>
  if (error) return <p>Não foi possível carregar o personagem.</p>
  if (!data.personagem) return <p>Personagem não encontrado.</p>

  const { nome, nacao, idade, historia, sonhos } = data.personagem

  return (
    <article className="personagem-detalhe">
      <Link to="/">&larr; Voltar para a listagem</Link>
      <h2>{nome}</h2>
      <p className="personagem-detalhe__nacao">{nacao} · {idade} anos</p>
      <section>
        <h3>História</h3>
        <p>{historia}</p>
      </section>
      <section>
        <h3>Sonhos</h3>
        <p>{sonhos}</p>
      </section>
    </article>
  )
}
