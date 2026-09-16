import { useCallback, useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import {
  CHAVE_ARMAZENAMENTO,
  ContextoAutenticacao,
  lerSessaoSalva,
  salvarSessao,
} from '../utils/autenticacao.js'

export function ProvedorAutenticacao({ children }) {
  const [sessao, setSessao] = useState(() => lerSessaoSalva())
  const client = useApolloClient()

  useEffect(() => {
    function sincronizarComOutrasAbas(evento) {
      if (evento.storageArea === localStorage && evento.key === CHAVE_ARMAZENAMENTO) {
        setSessao(lerSessaoSalva())
      }
    }
    window.addEventListener('storage', sincronizarComOutrasAbas)
    return () => window.removeEventListener('storage', sincronizarComOutrasAbas)
  }, [])

  const entrar = useCallback((token, usuario) => {
    const novaSessao = { token, usuario }
    salvarSessao(novaSessao)
    setSessao(novaSessao)
    client.clearStore()
  }, [client])

  const sair = useCallback(() => {
    salvarSessao(null)
    setSessao(null)
    client.clearStore()
  }, [client])

  const valor = { usuario: sessao?.usuario ?? null, entrar, sair }

  return (
    <ContextoAutenticacao.Provider value={valor}>
      {children}
    </ContextoAutenticacao.Provider>
  )
}
