import { Fragment } from 'react'

export function FormularioAuth({
  titulo,
  campos,
  mensagemErro,
  loading,
  textoBotao,
  textoCarregando,
  rodape,
  aoEnviar,
}) {
  return (
    <div className="formulario-auth">
      <h2>{titulo}</h2>
      <form onSubmit={aoEnviar} noValidate>
        {campos.map((campo) => (
          <Fragment key={campo.id}>
            <label htmlFor={campo.id}>{campo.label}</label>
            <input
              id={campo.id}
              type={campo.type}
              autoComplete={campo.autoComplete}
              required={campo.required}
              minLength={campo.minLength}
              value={campo.value}
              onChange={campo.onChange}
            />
          </Fragment>
        ))}

        {mensagemErro && (
          <p className="formulario-auth__erro" role="alert">
            {mensagemErro}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? textoCarregando : textoBotao}
        </button>
      </form>
      <p className="formulario-auth__rodape">{rodape}</p>
    </div>
  )
}
