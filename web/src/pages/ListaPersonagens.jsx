import { useQuery } from '@apollo/client/react'
import { motion } from 'framer-motion'
import { PERSONAGENS_QUERY } from '../graphql/queries.js'
import { PersonagemCard } from '../components/PersonagemCard.jsx'

const grade = {
  oculto: {},
  visivel: {
    transition: { staggerChildren: 0.05 },
  },
}

export function ListaPersonagens() {
  const { data, loading, error } = useQuery(PERSONAGENS_QUERY)

  if (loading) return <p className="estado-info">Carregando personagens...</p>
  if (error) return <p className="estado-info estado-info--erro">Não foi possível carregar os personagens.</p>

  return (
    <motion.section className="personagens-grid" variants={grade} initial="oculto" animate="visivel">
      {data.personagens.map((personagem) => (
        <PersonagemCard key={personagem.id} personagem={personagem} />
      ))}
    </motion.section>
  )
}
