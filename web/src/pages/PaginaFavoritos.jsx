import { Navigate } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { AnimatePresence, motion } from 'framer-motion'
import { MEUS_FAVORITOS_QUERY } from '../graphql/queries.js'
import { PersonagemCard } from '../components/PersonagemCard.jsx'
import { useAutenticacao } from '../utils/autenticacao.js'
import { ROTA_LOGIN } from '../utils/rotas.js'

const grade = {
  oculto: {},
  visivel: {
    transition: { staggerChildren: 0.05 },
  },
}

export function PaginaFavoritos() {
  const { usuario } = useAutenticacao()
  const { data, loading, error } = useQuery(MEUS_FAVORITOS_QUERY, { skip: !usuario })

  if (!usuario) return <Navigate to={ROTA_LOGIN} replace />

  let estado = 'conteudo'
  if (loading) estado = 'carregando'
  else if (error) estado = 'erro'

  const favoritos = estado === 'conteudo' ? data.meusFavoritos : []

  return (
    <AnimatePresence mode="wait">
      {estado === 'carregando' && (
        <motion.p key="carregando" className="estado-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          Carregando favoritos...
        </motion.p>
      )}
      {estado === 'erro' && (
        <motion.p key="erro" className="estado-info estado-info--erro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          Não foi possível carregar seus favoritos.
        </motion.p>
      )}
      {estado === 'conteudo' && favoritos.length === 0 && (
        <motion.p key="vazio" className="estado-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          Você ainda não favoritou nenhum personagem.
        </motion.p>
      )}
      {estado === 'conteudo' && favoritos.length > 0 && (
        <motion.section
          key="conteudo"
          className="personagens-grid"
          variants={grade}
          initial="oculto"
          animate="visivel"
        >
          {favoritos.map((personagem) => (
            <PersonagemCard key={personagem.id} personagem={personagem} />
          ))}
        </motion.section>
      )}
    </AnimatePresence>
  )
}
