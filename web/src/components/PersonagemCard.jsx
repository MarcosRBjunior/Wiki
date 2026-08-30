import { Link } from 'react-router-dom'
import { corVarDaNacao, corTextoVarDaNacao } from '../utils/nacao.js'

export function PersonagemCard({ personagem }) {
  const estiloNacao = {
    '--cor-nacao-atual': `var(${corVarDaNacao(personagem.nacao)})`,
    '--cor-sobre-nacao-atual': `var(${corTextoVarDaNacao(personagem.nacao)})`,
  }

  return (
    <Link to={`/personagens/${personagem.id}`} className="personagem-card" style={estiloNacao}>
      <div className="personagem-card__avatar" aria-hidden="true">
        {personagem.nome.charAt(0)}
      </div>
      <h2>{personagem.nome}</h2>
      <p className="personagem-card__nacao">{personagem.nacao}</p>
    </Link>
  )
}
