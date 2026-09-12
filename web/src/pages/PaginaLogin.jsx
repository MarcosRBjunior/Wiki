import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LOGIN_MUTATION } from '../graphql/queries.js'
import { useFormularioAuth } from '../utils/useFormularioAuth.js'
import { FormularioAuth } from '../components/FormularioAuth.jsx'
import { ROTA_CADASTRO } from '../utils/rotas.js'

export function PaginaLogin() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { enviar, loading, mensagemErro } = useFormularioAuth(LOGIN_MUTATION, (data) => ({
    token: data.login.token,
    usuario: data.login.usuario,
  }))

  function aoEnviar(evento) {
    evento.preventDefault()
    enviar({ email, senha })
  }

  return (
    <FormularioAuth
      titulo="Entrar"
      aoEnviar={aoEnviar}
      loading={loading}
      mensagemErro={mensagemErro}
      textoBotao="Entrar"
      textoCarregando="Entrando..."
      campos={[
        {
          id: 'login-email',
          label: 'E-mail',
          type: 'email',
          autoComplete: 'email',
          required: true,
          value: email,
          onChange: (evento) => setEmail(evento.target.value),
        },
        {
          id: 'login-senha',
          label: 'Senha',
          type: 'password',
          autoComplete: 'current-password',
          required: true,
          value: senha,
          onChange: (evento) => setSenha(evento.target.value),
        },
      ]}
      rodape={
        <>
          Ainda não tem conta? <Link to={ROTA_CADASTRO}>Criar conta</Link>
        </>
      }
    />
  )
}
