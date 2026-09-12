import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { LOGIN_MUTATION } from '../graphql/queries.js'
import { useAutenticacao } from '../utils/autenticacao.js'
import { ROTA_MURAL, ROTA_CADASTRO } from '../utils/rotas.js'

export function PaginaLogin() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { entrar } = useAutenticacao()
  const navigate = useNavigate()
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION)

  async function aoEnviar(evento) {
    evento.preventDefault()
    try {
      const { data } = await login({ variables: { email, senha } })
      entrar(data.login.token, data.login.usuario)
      navigate(ROTA_MURAL)
    } catch {
      // erro já refletido no estado `error` do useMutation
    }
  }

  return (
    <div className="formulario-auth">
      <h2>Entrar</h2>
      <form onSubmit={aoEnviar} noValidate>
        <label htmlFor="login-email">E-mail</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
        />

        <label htmlFor="login-senha">Senha</label>
        <input
          id="login-senha"
          type="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
        />

        {error && (
          <p className="formulario-auth__erro" role="alert">
            {error.message}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="formulario-auth__rodape">
        Ainda não tem conta? <Link to={ROTA_CADASTRO}>Criar conta</Link>
      </p>
    </div>
  )
}
