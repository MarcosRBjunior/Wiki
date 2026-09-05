import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { AnimatePresence, motion } from 'framer-motion'
import { PERSONAGENS_QUERY } from '../graphql/queries.js'
import { PersonagemCard } from '../components/PersonagemCard.jsx'
import { categoriaNacao, NACOES_FILTRO } from '../utils/nacao.js'

const grade = {
  oculto: {},
  visivel: {
    transition: { staggerChildren: 0.05 },
  },
}

const CATEGORIAS_VALIDAS = new Set(['agua', 'fogo', 'terra', 'ar'])

export function ListaPersonagens() {
  const { data, loading, error } = useQuery(PERSONAGENS_QUERY)
  const [searchParams, setSearchParams] = useSearchParams()
  const filtroUrl = searchParams.get('nacao')
  const filtro = CATEGORIAS_VALIDAS.has(filtroUrl) ? filtroUrl : null

  function selecionarFiltro(categoria) {
    if (categoria) setSearchParams({ nacao: categoria })
    else setSearchParams({})
  }

  let estado = 'conteudo'
  if (loading) estado = 'carregando'
  else if (error) estado = 'erro'

  const personagens =
    estado === 'conteudo' && filtro
      ? data.personagens.filter((personagem) => categoriaNacao(personagem.nacao) === filtro)
      : data?.personagens

  return (
    <AnimatePresence mode="wait">
      {estado === 'carregando' && (
        <motion.p key="carregando" className="estado-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          Carregando personagens...
        </motion.p>
      )}
      {estado === 'erro' && (
        <motion.p key="erro" className="estado-info estado-info--erro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          Não foi possível carregar os personagens.
        </motion.p>
      )}
      {estado === 'conteudo' && (
        <motion.div key="conteudo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="filtro-nacao" role="group" aria-label="Filtrar por nação">
            <button
              type="button"
              className={`filtro-nacao__botao${filtro === null ? ' filtro-nacao__botao--ativo' : ''}`}
              onClick={() => selecionarFiltro(null)}
            >
              Todos
            </button>
            {NACOES_FILTRO.map(({ categoria, rotulo, corVar }) => (
              <button
                key={categoria}
                type="button"
                className={`filtro-nacao__botao${filtro === categoria ? ' filtro-nacao__botao--ativo' : ''}`}
                style={{ '--cor-filtro': `var(${corVar})` }}
                onClick={() => selecionarFiltro(categoria)}
              >
                <svg aria-hidden="true"><use href={`#icon-${categoria}`} /></svg>
                {rotulo}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.section
              key={filtro ?? 'todos'}
              className="personagens-grid"
              variants={grade}
              initial="oculto"
              animate="visivel"
              exit={{ opacity: 0 }}
            >
              {personagens.map((personagem) => (
                <PersonagemCard key={personagem.id} personagem={personagem} />
              ))}
            </motion.section>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
