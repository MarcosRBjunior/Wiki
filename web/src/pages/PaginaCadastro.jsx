import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { CRIAR_CONTA_MUTATION } from '../graphql/queries.js'
import { useAutenticacao } from '../utils/autenticacao.js'
import { ROTA_MURAL, ROTA_LOGIN } from '../utils/rotas.js'

export function PaginaCadastro() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const { entrar } = useAutenticacao()
  const navigate = useNavigate()
  const [criarConta, { loading, error }] = useMutation(CRIAR_CONTA_MUTATION)

  async function aoEnviar(evento) {
    evento.preventDefault()
    try {
      const { data } = await criarConta({ variables: { email, senha } })
      entrar(data.criarConta.token, data.criarConta.usuario)
      navigate(ROTA_MURAL)
    } catch {
      // erro já refletido no estado `error` do useMutation
    }
  }

  return (
    <div className="formulario-auth">
      <h2>Criar conta</h2>
      <form onSubmit={aoEnviar} noValidate>
        <label htmlFor="cadastro-email">E-mail</label>
        <input
          id="cadastro-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
        />

        <label htmlFor="cadastro-senha">Senha</label>
        <input
          id="cadastro-senha"
          type="password"
          autoComplete="new-password"
          minLength={8}
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
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
      <p className="formulario-auth__rodape">
        Já tem conta? <Link to={ROTA_LOGIN}>Entrar</Link>
      </p>
    </div>
  )
}
