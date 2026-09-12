export const ROTA_MURAL = '/'
export const ROTA_PERSONAGENS = '/personagens'
export const ROTA_LOGIN = '/login'
export const ROTA_CADASTRO = '/cadastro'

export function rotaPersonagem(id) {
  return `/personagens/${id}`
}
