import { useParams } from 'react-router-dom'

export function PersonagemDetalhe() {
  const { id } = useParams()

  return <p>Página de detalhe do personagem {id} (em construção).</p>
}
