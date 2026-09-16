import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { useAutenticacao } from './autenticacao.js'
import { ROTA_MURAL } from './rotas.js'

export function useFormularioAuth(mutationDocument, extrairAutenticacao) {
  const [executar, { loading, error }] = useMutation(mutationDocument)
  const { entrar } = useAutenticacao()
  const navigate = useNavigate()
  const [erroPosSucesso, setErroPosSucesso] = useState(null)

  async function enviar(variaveis) {
    setErroPosSucesso(null)
    let data
    try {
      ;({ data } = await executar({ variables: variaveis }))
    } catch {
      return // erro da mutation já refletido no `error` do useMutation
    }

    try {
      const { token, usuario } = extrairAutenticacao(data)
      entrar(token, usuario)
      navigate(ROTA_MURAL)
    } catch (erro) {
      console.error('Falha ao concluir a autenticação após a resposta da API:', erro)
      setErroPosSucesso(
        'Conta autenticada, mas houve um problema ao continuar. Recarregue a página e tente de novo.',
      )
    }
  }

  return { enviar, loading, mensagemErro: erroPosSucesso ?? error?.message ?? null }
}
