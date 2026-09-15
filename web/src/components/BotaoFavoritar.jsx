import { useMutation } from '@apollo/client/react'
import { motion } from 'framer-motion'
import { FAVORITAR_MUTATION, DESFAVORITAR_MUTATION } from '../graphql/queries.js'

export function BotaoFavoritar({ personagemId, favoritado, className = '' }) {
  const [favoritar, { loading: enviandoFavoritar }] = useMutation(FAVORITAR_MUTATION)
  const [desfavoritar, { loading: enviandoDesfavoritar }] = useMutation(DESFAVORITAR_MUTATION)
  const enviando = enviandoFavoritar || enviandoDesfavoritar

  async function aoClicar() {
    const proximoEstado = !favoritado
    const mutar = favoritado ? desfavoritar : favoritar
    const campo = favoritado ? 'desfavoritar' : 'favoritar'

    try {
      await mutar({
        variables: { personagemId },
        optimisticResponse: {
          [campo]: { __typename: 'Personagem', id: personagemId, favoritado: proximoEstado },
        },
      })
    } catch (erro) {
      console.error('Falha ao atualizar favorito:', erro)
    }
  }

  const rotulo = favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'

  return (
    <motion.button
      type="button"
      className={`botao-favoritar${favoritado ? ' botao-favoritar--ativo' : ''} ${className}`.trim()}
      onClick={aoClicar}
      disabled={enviando}
      aria-pressed={favoritado}
      aria-label={rotulo}
      title={rotulo}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 20.6 4.6 13.1a5 5 0 0 1 7.4-6.7 5 5 0 0 1 7.4 6.7Z" />
      </svg>
    </motion.button>
  )
}
