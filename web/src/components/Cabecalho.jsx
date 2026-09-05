import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionLink = motion.create(Link)
const springNav = { type: 'spring', stiffness: 400, damping: 25 }

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
          <MotionLink to="/" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} transition={springNav}>
            Personagens
          </MotionLink>
          <MotionLink to="/mural" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} transition={springNav}>
            Mural
          </MotionLink>
        </nav>
      </div>
    </header>
  )
}
