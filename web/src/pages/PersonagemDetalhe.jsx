import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { PERSONAGEM_QUERY } from '../graphql/queries.js'
import { corVarDaNacao, corTextoVarDaNacao } from '../utils/nacao.js'

export function PersonagemDetalhe() {
  const { id } = useParams()
  const { data, loading, error } = useQuery(PERSONAGEM_QUERY, { variables: { id } })

  if (loading) return <p className="estado-info">Carregando personagem...</p>
  if (error) return <p className="estado-info estado-info--erro">Não foi possível carregar o personagem.</p>
  if (!data.personagem) return <p className="estado-info">Personagem não encontrado.</p>

  const { nome, nacao, idade, historia, sonhos } = data.personagem
  const estiloNacao = {
    '--cor-nacao-atual': `var(${corVarDaNacao(nacao)})`,
    '--cor-sobre-nacao-atual': `var(${corTextoVarDaNacao(nacao)})`,
  }

  return (
    <article className="personagem-detalhe" style={estiloNacao}>
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
    </article>
  )
}
