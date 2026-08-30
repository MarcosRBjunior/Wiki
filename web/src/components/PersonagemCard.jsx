import { Link } from 'react-router-dom'

export function PersonagemCard({ personagem }) {
  return (
    <Link to={`/personagens/${personagem.id}`} className="personagem-card">
      <div className="personagem-card__avatar" aria-hidden="true">
        {personagem.nome.charAt(0)}
      </div>
      <h2>{personagem.nome}</h2>
      <p>{personagem.nacao}</p>
    </Link>
  )
}
