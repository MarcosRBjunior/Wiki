import { useCallback, useState } from 'react'
import { ContextoAutenticacao, lerSessaoSalva, salvarSessao } from '../utils/autenticacao.js'

export function ProvedorAutenticacao({ children }) {
  const [sessao, setSessao] = useState(() => lerSessaoSalva())

  const entrar = useCallback((token, usuario) => {
    const novaSessao = { token, usuario }
    salvarSessao(novaSessao)
    setSessao(novaSessao)
  }, [])

  const sair = useCallback(() => {
    salvarSessao(null)
    setSessao(null)
  }, [])

  const valor = { usuario: sessao?.usuario ?? null, entrar, sair }

  return (
    <ContextoAutenticacao.Provider value={valor}>
      {children}
    </ContextoAutenticacao.Provider>
  )
}
