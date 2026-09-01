import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { estiloNacaoVars } from '../utils/nacao.js'
import { AvatarPersonagem } from './AvatarPersonagem.jsx'

const MotionLink = motion.create(Link)

const item = {
  oculto: { opacity: 0, y: 12 },
  visivel: { opacity: 1, y: 0 },
}

export function PersonagemCard({ personagem }) {
  return (
    <MotionLink
      to={`/personagens/${personagem.id}`}
      className="personagem-card"
      style={estiloNacaoVars(personagem.nacao)}
      variants={item}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <AvatarPersonagem
        nome={personagem.nome}
        imagem={personagem.imagem}
        className="personagem-card__avatar"
      />
      <h2>{personagem.nome}</h2>
      <p className="personagem-card__nacao">
        <span className="selo-nacao">{personagem.nacao}</span>
      </p>
    </MotionLink>
  )
}
