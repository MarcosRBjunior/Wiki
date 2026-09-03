// Cores das nações e o par de texto com contraste WCAG AA garantido sobre cada uma.
const NACOES = [
  { palavraChave: 'ar', categoria: 'ar', corVar: '--cor-ar', corTextoVar: '--cor-sobre-ar' },
  { palavraChave: 'água', categoria: 'agua', corVar: '--cor-agua', corTextoVar: '--cor-sobre-agua' },
  { palavraChave: 'fogo', categoria: 'fogo', corVar: '--cor-fogo', corTextoVar: '--cor-sobre-fogo' },
  { palavraChave: 'terra', categoria: 'terra', corVar: '--cor-terra', corTextoVar: '--cor-sobre-terra' },
  { palavraChave: 'kyoshi', categoria: 'terra', corVar: '--cor-terra', corTextoVar: '--cor-sobre-terra' },
]

const PADRAO = { categoria: null, corVar: '--cor-primaria', corTextoVar: '--cor-sobre-primaria' }

function encontrarNacao(nacao) {
  const palavras = (nacao ?? '').normalize('NFC').toLowerCase().split(/\s+/)
  return NACOES.find(({ palavraChave }) => palavras.includes(palavraChave)) ?? PADRAO
}

export function estiloNacaoVars(nacao) {
  const { corVar, corTextoVar } = encontrarNacao(nacao)
  return {
    '--cor-nacao-atual': `var(${corVar})`,
    '--cor-sobre-nacao-atual': `var(${corTextoVar})`,
  }
}

export function categoriaNacao(nacao) {
  return encontrarNacao(nacao).categoria
}

export function iconeNacao(nacao) {
  const categoria = categoriaNacao(nacao)
  return categoria ? `#icon-${categoria}` : null
}

// Ordem usada pelos botões de filtro na listagem.
export const NACOES_FILTRO = [
  { categoria: 'agua', rotulo: 'Água', corVar: '--cor-agua' },
  { categoria: 'fogo', rotulo: 'Fogo', corVar: '--cor-fogo' },
  { categoria: 'terra', rotulo: 'Terra', corVar: '--cor-terra' },
  { categoria: 'ar', rotulo: 'Ar', corVar: '--cor-ar' },
]
