import { Link } from 'react-router-dom'

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho__interior">
        <h1 className="cabecalho__marca">
          <Link to="/">
            <span className="cabecalho__emblema" aria-hidden="true" />
            Wiki de Fãs
          </Link>
        </h1>
        <p className="cabecalho__subtitulo">Avatar: A Lenda de Aang</p>
      </div>
    </header>
  )
}
