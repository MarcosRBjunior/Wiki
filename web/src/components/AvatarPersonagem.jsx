import { useState } from 'react'
import { avatarGeradoUrl } from '../utils/nacao.js'

export function AvatarPersonagem({ nome, imagem, nacao, className }) {
  const [falhouCarregar, setFalhouCarregar] = useState(false)
  const [falhouGerado, setFalhouGerado] = useState(false)
  const [imagemAnterior, setImagemAnterior] = useState(imagem)

  if (imagem !== imagemAnterior) {
    setImagemAnterior(imagem)
    setFalhouCarregar(false)
    setFalhouGerado(false)
  }

  if ((!imagem || falhouCarregar) && !falhouGerado) {
    return (
      <img
        src={avatarGeradoUrl(nome, nacao)}
        alt={nome}
        className={className}
        onError={() => setFalhouGerado(true)}
      />
    )
  }

  if (falhouGerado) {
    return (
      <div className={className} aria-hidden="true">
        {nome.charAt(0)}
      </div>
    )
  }

  return (
    <img
      src={imagem}
      alt={nome}
      className={className}
      onError={() => setFalhouCarregar(true)}
    />
  )
}
