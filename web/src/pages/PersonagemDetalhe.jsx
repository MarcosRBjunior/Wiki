import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { motion } from 'framer-motion'
import { PERSONAGEM_QUERY } from '../graphql/queries.js'
import { estiloNacaoVars, iconeNacao } from '../utils/nacao.js'
import { AvatarPersonagem } from '../components/AvatarPersonagem.jsx'

export function PersonagemDetalhe() {
  const { id } = useParams()
  const { data, loading, error } = useQuery(PERSONAGEM_QUERY, { variables: { id } })

  if (loading) return <p className="estado-info">Carregando personagem...</p>
  if (error) return <p className="estado-info estado-info--erro">Não foi possível carregar o personagem.</p>
  if (!data.personagem) return <p className="estado-info">Personagem não encontrado.</p>

  const { nome, nacao, idade, historia, sonhos, imagem } = data.personagem
  const icone = iconeNacao(nacao)

  return (
    <motion.article
      className="personagem-detalhe"
      style={estiloNacaoVars(nacao)}
      initial={{ y: 16 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Link to="/" className="personagem-detalhe__voltar">
        <svg aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        Voltar para a listagem
      </Link>
      <header className="personagem-detalhe__cabecalho">
        {icone && (
          <span className="personagem-detalhe__marca-dagua" aria-hidden="true">
            <svg><use href={icone} /></svg>
          </span>
        )}
        <AvatarPersonagem nome={nome} imagem={imagem} className="personagem-detalhe__avatar" />
        <h2>{nome}</h2>
        <p className="personagem-detalhe__nacao">
          <span className="selo-nacao">
            {icone && <svg aria-hidden="true"><use href={icone} /></svg>}
            {nacao}
          </span>
          <span className="personagem-detalhe__idade">{idade} anos</span>
        </p>
      </header>
      <section className="personagem-detalhe__secao">
        <div className="divisor"><span className="divisor__marca" /></div>
        <h3>História</h3>
        <p>{historia}</p>
      </section>
      <section className="personagem-detalhe__secao">
        <div className="divisor"><span className="divisor__marca" /></div>
        <h3>Sonhos</h3>
        <p>{sonhos}</p>
      </section>
    </motion.article>
  )
}
