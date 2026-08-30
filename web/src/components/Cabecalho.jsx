import { Link } from 'react-router-dom'

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho__interior">
        <Link to="/" className="cabecalho__marca">
          <span className="cabecalho__emblema" aria-hidden="true" />
          Wiki de Fãs
        </Link>
        <p className="cabecalho__subtitulo">Avatar: A Lenda de Aang</p>
      </div>
    </header>
  )
}
