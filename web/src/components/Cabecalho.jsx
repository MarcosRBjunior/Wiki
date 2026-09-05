import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ROTA_MURAL, ROTA_PERSONAGENS } from '../utils/rotas.js'
import { useTema } from '../utils/tema.js'

const MotionLink = motion.create(Link)
const springNav = { type: 'spring', stiffness: 400, damping: 25 }

function BotaoTema() {
  const { temaEfetivo, alternar } = useTema()
  const rotulo = temaEfetivo === 'escuro' ? 'Ativar tema claro' : 'Ativar tema escuro'

  return (
    <motion.button
      type="button"
      className="cabecalho__botao-tema"
      onClick={alternar}
      aria-label={rotulo}
      title={rotulo}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={springNav}
    >
      {temaEfetivo === 'escuro' ? (
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36A5.5 5.5 0 0 1 12 3.1 8.9 8.9 0 0 0 12 3Z" /></svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5 3.6 3.6M20.4 20.4 19 19M19 5l1.4-1.4M3.6 20.4 5 19" strokeLinecap="round" /></svg>
      )}
    </motion.button>
  )
}

export function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho__interior">
        <div className="cabecalho__identidade">
          <Link to={ROTA_MURAL} className="cabecalho__marca">
            <span className="cabecalho__emblema" aria-hidden="true">
              <span className="cabecalho__emblema-ponto" />
            </span>
            <h1>Wiki dos Quatro Elementos</h1>
          </Link>
          <p className="cabecalho__subtitulo">Avatar · A Lenda de Aang</p>
        </div>
        <nav className="cabecalho__nav" aria-label="Navegação principal">
          <MotionLink to={ROTA_PERSONAGENS} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} transition={springNav}>
            Personagens
          </MotionLink>
          <MotionLink to={ROTA_MURAL} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} transition={springNav}>
            Mural
          </MotionLink>
          <BotaoTema />
        </nav>
      </div>
    </header>
  )
}
