import { useState } from 'react'

export function AvatarPersonagem({ nome, imagem, className }) {
  const [falhouCarregar, setFalhouCarregar] = useState(false)
  const [imagemAnterior, setImagemAnterior] = useState(imagem)

  if (imagem !== imagemAnterior) {
    setImagemAnterior(imagem)
    setFalhouCarregar(false)
  }

  if (!imagem || falhouCarregar) {
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
