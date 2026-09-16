import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CRIAR_CONTA_MUTATION } from '../graphql/queries.js'
import { useFormularioAuth } from '../utils/useFormularioAuth.js'
import { FormularioAuth } from '../components/FormularioAuth.jsx'
import { ROTA_LOGIN } from '../utils/rotas.js'

export function PaginaCadastro() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { enviar, loading, mensagemErro } = useFormularioAuth(CRIAR_CONTA_MUTATION, (data) => ({
    token: data.criarConta.token,
    usuario: data.criarConta.usuario,
  }))

  function aoEnviar(evento) {
    evento.preventDefault()
    enviar({ email, senha })
  }

  return (
    <FormularioAuth
      titulo="Criar conta"
      aoEnviar={aoEnviar}
      loading={loading}
      mensagemErro={mensagemErro}
      textoBotao="Criar conta"
      textoCarregando="Criando conta..."
      campos={[
        {
          id: 'cadastro-email',
          label: 'E-mail',
          type: 'email',
          autoComplete: 'email',
          required: true,
          value: email,
          onChange: (evento) => setEmail(evento.target.value),
        },
        {
          id: 'cadastro-senha',
          label: 'Senha',
          type: 'password',
          autoComplete: 'new-password',
          required: true,
          minLength: 8,
          value: senha,
          onChange: (evento) => setSenha(evento.target.value),
        },
      ]}
      rodape={
        <>
          Já tem conta? <Link to={ROTA_LOGIN}>Entrar</Link>
        </>
      }
    />
  )
}
