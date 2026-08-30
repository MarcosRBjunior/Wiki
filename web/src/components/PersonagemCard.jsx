import { Link } from 'react-router-dom'
import { estiloNacaoVars } from '../utils/nacao.js'

export function PersonagemCard({ personagem }) {
  return (
    <Link to={`/personagens/${personagem.id}`} className="personagem-card" style={estiloNacaoVars(personagem.nacao)}>
      <div className="personagem-card__avatar" aria-hidden="true">
        {personagem.nome.charAt(0)}
      </div>
      <h2>{personagem.nome}</h2>
      <p className="personagem-card__nacao">{personagem.nacao}</p>
    </Link>
  )
}
