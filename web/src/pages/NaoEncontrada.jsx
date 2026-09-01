import { Link } from 'react-router-dom'

export function NaoEncontrada() {
  return (
    <div className="estado-info">
      <p>Página não encontrada.</p>
      <Link to="/">&larr; Voltar para a listagem</Link>
    </div>
  )
}
