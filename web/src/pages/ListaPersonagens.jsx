import { useQuery } from '@apollo/client/react'
import { PERSONAGENS_QUERY } from '../graphql/queries.js'
import { PersonagemCard } from '../components/PersonagemCard.jsx'

export function ListaPersonagens() {
  const { data, loading, error } = useQuery(PERSONAGENS_QUERY)

  if (loading) return <p>Carregando personagens...</p>
  if (error) return <p>Não foi possível carregar os personagens.</p>

  return (
    <section className="personagens-grid">
      {data.personagens.map((personagem) => (
        <PersonagemCard key={personagem.id} personagem={personagem} />
      ))}
    </section>
  )
}
