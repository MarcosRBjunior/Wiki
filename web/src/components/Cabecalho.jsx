import { Link } from 'react-router-dom'

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho__interior">
        <Link to="/" className="cabecalho__marca">
          <span className="cabecalho__emblema" aria-hidden="true">
            <span className="cabecalho__emblema-ponto" />
          </span>
          <h1>Wiki dos Quatro Elementos</h1>
        </Link>
        <p className="cabecalho__subtitulo">Avatar · A Lenda de Aang</p>
      </div>
    </header>
  )
}
