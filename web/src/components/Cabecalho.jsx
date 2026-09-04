import { Link } from 'react-router-dom'

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho__interior">
        <div className="cabecalho__identidade">
          <Link to="/" className="cabecalho__marca">
            <span className="cabecalho__emblema" aria-hidden="true">
              <span className="cabecalho__emblema-ponto" />
            </span>
            <h1>Wiki dos Quatro Elementos</h1>
          </Link>
          <p className="cabecalho__subtitulo">Avatar · A Lenda de Aang</p>
        </div>
        <nav className="cabecalho__nav" aria-label="Navegação principal">
          <Link to="/">Personagens</Link>
          <Link to="/mural">Mural</Link>
        </nav>
      </div>
    </header>
  )
}
