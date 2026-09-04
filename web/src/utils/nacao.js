// Cores das nações e o par de texto com contraste WCAG AA garantido sobre cada uma.
// corHex/corTextoHex espelham --cor-*/--cor-sobre-* em hexadecimal, para uso em contextos
// que não leem variáveis CSS (ex.: URL de avatar gerado por serviço externo).
const NACOES = [
  { palavraChave: 'ar', categoria: 'ar', corVar: '--cor-ar', corTextoVar: '--cor-sobre-ar', corHex: 'e7ac2a', corTextoHex: '3d2e17' },
  { palavraChave: 'água', categoria: 'agua', corVar: '--cor-agua', corTextoVar: '--cor-sobre-agua', corHex: '0086be', corTextoHex: 'ffffff' },
  { palavraChave: 'fogo', categoria: 'fogo', corVar: '--cor-fogo', corTextoVar: '--cor-sobre-fogo', corHex: 'c52b2d', corTextoHex: 'ffffff' },
  { palavraChave: 'terra', categoria: 'terra', corVar: '--cor-terra', corTextoVar: '--cor-sobre-terra', corHex: '338946', corTextoHex: 'ffffff' },
  { palavraChave: 'kyoshi', categoria: 'terra', corVar: '--cor-terra', corTextoVar: '--cor-sobre-terra', corHex: '338946', corTextoHex: 'ffffff' },
]

const PADRAO = { categoria: null, corVar: '--cor-primaria', corTextoVar: '--cor-sobre-primaria', corHex: 'e7ac2a', corTextoHex: '3d2e17' }

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

// Avatar gerado por serviço externo gratuito (ui-avatars.com), colorido conforme a nação.
// Usado como retrato quando o personagem não tem foto própria.
export function avatarGeradoUrl(nome, nacao) {
  const { corHex, corTextoHex } = encontrarNacao(nacao)
  const params = new URLSearchParams({
    name: nome,
    background: corHex,
    color: corTextoHex,
    size: '256',
    'font-size': '0.4',
    bold: 'true',
  })
  return `https://ui-avatars.com/api/?${params}`
}

// Ordem usada pelos botões de filtro na listagem.
export const NACOES_FILTRO = [
  { categoria: 'agua', rotulo: 'Água', corVar: '--cor-agua' },
  { categoria: 'fogo', rotulo: 'Fogo', corVar: '--cor-fogo' },
  { categoria: 'terra', rotulo: 'Terra', corVar: '--cor-terra' },
  { categoria: 'ar', rotulo: 'Ar', corVar: '--cor-ar' },
]
