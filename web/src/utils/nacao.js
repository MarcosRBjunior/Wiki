// Cores das nações e o par de texto com contraste WCAG AA garantido sobre cada uma.
const NACOES = [
  { palavraChave: 'ar', corVar: '--cor-ar', corTextoVar: '--cor-sobre-ar' },
  { palavraChave: 'água', corVar: '--cor-agua', corTextoVar: '--cor-sobre-agua' },
  { palavraChave: 'fogo', corVar: '--cor-fogo', corTextoVar: '--cor-sobre-fogo' },
  { palavraChave: 'terra', corVar: '--cor-terra', corTextoVar: '--cor-sobre-terra' },
  { palavraChave: 'kyoshi', corVar: '--cor-terra', corTextoVar: '--cor-sobre-terra' },
]

const PADRAO = { corVar: '--cor-primaria', corTextoVar: '--cor-sobre-primaria' }

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
