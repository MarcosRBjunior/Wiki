import { createContext, useContext } from 'react'

export const CHAVE_ARMAZENAMENTO = 'wiki-sessao'

export function lerSessaoSalva() {
  try {
    const bruto = localStorage.getItem(CHAVE_ARMAZENAMENTO)
    return bruto ? JSON.parse(bruto) : null
  } catch {
    return null
  }
}

export function salvarSessao(sessao) {
  try {
    if (sessao) localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(sessao))
    else localStorage.removeItem(CHAVE_ARMAZENAMENTO)
  } catch {
    // localStorage indisponível (modo privado, etc.) — segue sem persistir
  }
}

export const ContextoAutenticacao = createContext(null)

export function useAutenticacao() {
  const contexto = useContext(ContextoAutenticacao)
  if (contexto === null) {
    throw new Error('useAutenticacao deve ser usado dentro de ProvedorAutenticacao')
  }
  return contexto
}
