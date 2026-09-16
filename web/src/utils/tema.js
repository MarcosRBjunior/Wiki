import { useCallback, useEffect, useState } from 'react'

const CHAVE_ARMAZENAMENTO = 'wiki-tema'

function lerTemaSalvo() {
  try {
    return localStorage.getItem(CHAVE_ARMAZENAMENTO)
  } catch {
    return null
  }
}

function salvarTema(tema) {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, tema)
  } catch {
    // localStorage indisponível (modo privado, etc.) — segue sem persistir
  }
}

function preferSistemaEscuro() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

function temaEfetivo(tema) {
  if (tema === 'claro' || tema === 'escuro') return tema
  return preferSistemaEscuro() ? 'escuro' : 'claro'
}

export function useTema() {
  const [tema, setTema] = useState(() => lerTemaSalvo() ?? 'sistema')

  useEffect(() => {
    if (tema === 'sistema') document.documentElement.removeAttribute('data-tema')
    else document.documentElement.setAttribute('data-tema', tema)
  }, [tema])

  const alternar = useCallback(() => {
    setTema((atual) => {
      const proximo = temaEfetivo(atual) === 'escuro' ? 'claro' : 'escuro'
      salvarTema(proximo)
      return proximo
    })
  }, [])

  return { temaEfetivo: temaEfetivo(tema), alternar }
}
