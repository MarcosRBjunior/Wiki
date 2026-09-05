import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ROTA_PERSONAGENS } from '../utils/rotas.js'

const MotionLink = motion.create(Link)

export function NaoEncontrada() {
  return (
    <div className="estado-info">
      <p>Página não encontrada.</p>
      <MotionLink
        to={ROTA_PERSONAGENS}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        &larr; Voltar para a listagem
      </MotionLink>
    </div>
  )
}
