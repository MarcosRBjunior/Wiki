import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { motion } from 'framer-motion'
import { PERSONAGEM_QUERY } from '../graphql/queries.js'
import { estiloNacaoVars } from '../utils/nacao.js'

export function PersonagemDetalhe() {
  const { id } = useParams()
  const { data, loading, error } = useQuery(PERSONAGEM_QUERY, { variables: { id } })

  if (loading) return <p className="estado-info">Carregando personagem...</p>
  if (error) return <p className="estado-info estado-info--erro">Não foi possível carregar o personagem.</p>
  if (!data.personagem) return <p className="estado-info">Personagem não encontrado.</p>

  const { nome, nacao, idade, historia, sonhos } = data.personagem

  return (
    <motion.article
      className="personagem-detalhe"
      style={estiloNacaoVars(nacao)}
      initial={{ y: 16 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Link to="/" className="personagem-detalhe__voltar">&larr; Voltar para a listagem</Link>
      <header className="personagem-detalhe__cabecalho">
        <h2>{nome}</h2>
        <p className="personagem-detalhe__nacao">
          <span className="selo-nacao">{nacao}</span> · {idade} anos
        </p>
      </header>
      <section className="personagem-detalhe__secao">
        <h3>História</h3>
        <p>{historia}</p>
      </section>
      <section className="personagem-detalhe__secao">
        <h3>Sonhos</h3>
        <p>{sonhos}</p>
      </section>
    </motion.article>
  )
}
