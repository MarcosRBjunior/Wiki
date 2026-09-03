import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { motion } from 'framer-motion'
import { PERSONAGENS_QUERY } from '../graphql/queries.js'
import { PersonagemCard } from '../components/PersonagemCard.jsx'
import { categoriaNacao, NACOES_FILTRO } from '../utils/nacao.js'

const grade = {
  oculto: {},
  visivel: {
    transition: { staggerChildren: 0.05 },
  },
}

export function ListaPersonagens() {
  const { data, loading, error } = useQuery(PERSONAGENS_QUERY)
  const [filtro, setFiltro] = useState(null)

  if (loading) return <p className="estado-info">Carregando personagens...</p>
  if (error) return <p className="estado-info estado-info--erro">Não foi possível carregar os personagens.</p>

  const personagens = filtro
    ? data.personagens.filter((personagem) => categoriaNacao(personagem.nacao) === filtro)
    : data.personagens

  return (
    <>
      <div className="filtro-nacao" role="group" aria-label="Filtrar por nação">
        <button
          type="button"
          className={`filtro-nacao__botao${filtro === null ? ' filtro-nacao__botao--ativo' : ''}`}
          onClick={() => setFiltro(null)}
        >
          Todos
        </button>
        {NACOES_FILTRO.map(({ categoria, rotulo, corVar }) => (
          <button
            key={categoria}
            type="button"
            className={`filtro-nacao__botao${filtro === categoria ? ' filtro-nacao__botao--ativo' : ''}`}
            style={{ '--cor-filtro': `var(${corVar})` }}
            onClick={() => setFiltro(categoria)}
          >
            <svg aria-hidden="true"><use href={`#icon-${categoria}`} /></svg>
            {rotulo}
          </button>
        ))}
      </div>
      <motion.section className="personagens-grid" variants={grade} initial="oculto" animate="visivel">
        {personagens.map((personagem) => (
          <PersonagemCard key={personagem.id} personagem={personagem} />
        ))}
      </motion.section>
    </>
  )
}
