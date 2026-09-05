import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { AnimatePresence, motion } from 'framer-motion'
import { PERSONAGEM_QUERY } from '../graphql/queries.js'
import { estiloNacaoVars, iconeNacao } from '../utils/nacao.js'
import { ROTA_PERSONAGENS } from '../utils/rotas.js'
import { AvatarPersonagem } from '../components/AvatarPersonagem.jsx'

function SecaoDetalhe({ titulo, texto, fechada, onAlternar }) {
  return (
    <motion.section className="personagem-detalhe__secao" layout>
      <div className="divisor"><span className="divisor__marca" /></div>
      <h3>
        <button
          type="button"
          className="personagem-detalhe__secao-toggle"
          onClick={onAlternar}
          aria-expanded={!fechada}
        >
          {titulo}
          <motion.span
            className="personagem-detalhe__secao-seta"
            aria-hidden="true"
            animate={{ rotate: fechada ? -90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▾
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {!fechada && (
          <motion.p
            key="texto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            {texto}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export function PersonagemDetalhe() {
  const { id } = useParams()
  const { data, loading, error } = useQuery(PERSONAGEM_QUERY, { variables: { id } })
  const [secoesFechadas, setSecoesFechadas] = useState(() => new Set())

  function alternarSecao(chave) {
    setSecoesFechadas((atual) => {
      const proximo = new Set(atual)
      if (proximo.has(chave)) proximo.delete(chave)
      else proximo.add(chave)
      return proximo
    })
  }

  let estado = 'conteudo'
  if (loading) estado = 'carregando'
  else if (error) estado = 'erro'
  else if (!data.personagem) estado = 'nao-encontrado'

  const personagem = estado === 'conteudo' ? data.personagem : null
  const icone = personagem ? iconeNacao(personagem.nacao) : null

  return (
    <AnimatePresence mode="wait">
      {estado === 'carregando' && (
        <motion.p key="carregando" className="estado-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          Carregando personagem...
        </motion.p>
      )}
      {estado === 'erro' && (
        <motion.p key="erro" className="estado-info estado-info--erro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          Não foi possível carregar o personagem.
        </motion.p>
      )}
      {estado === 'nao-encontrado' && (
        <motion.p key="nao-encontrado" className="estado-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          Personagem não encontrado.
        </motion.p>
      )}
      {estado === 'conteudo' && (
        <motion.article
          key="conteudo"
          className="personagem-detalhe"
          style={estiloNacaoVars(personagem.nacao)}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Link to={ROTA_PERSONAGENS} className="personagem-detalhe__voltar">
            <svg aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            Voltar para a listagem
          </Link>
          <header className="personagem-detalhe__cabecalho">
            {icone && (
              <span className="personagem-detalhe__marca-dagua" aria-hidden="true">
                <svg><use href={icone} /></svg>
              </span>
            )}
            <AvatarPersonagem nome={personagem.nome} imagem={personagem.imagem} nacao={personagem.nacao} className="personagem-detalhe__avatar" />
            <h2>{personagem.nome}</h2>
            <p className="personagem-detalhe__nacao">
              <span className="selo-nacao">
                {icone && <svg aria-hidden="true"><use href={icone} /></svg>}
                {personagem.nacao}
              </span>
              <span className="personagem-detalhe__idade">{personagem.idade} anos</span>
            </p>
          </header>
          <SecaoDetalhe
            titulo="História"
            texto={personagem.historia}
            fechada={secoesFechadas.has('historia')}
            onAlternar={() => alternarSecao('historia')}
          />
          <SecaoDetalhe
            titulo="Sonhos"
            texto={personagem.sonhos}
            fechada={secoesFechadas.has('sonhos')}
            onAlternar={() => alternarSecao('sonhos')}
          />
        </motion.article>
      )}
    </AnimatePresence>
  )
}
