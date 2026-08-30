import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing/react'
import { describe, expect, test } from 'vitest'
import App from './App.jsx'
import { PERSONAGENS_QUERY } from './graphql/queries.js'

const mocks = [
  {
    request: { query: PERSONAGENS_QUERY },
    result: { data: { personagens: [{ id: '1', nome: 'Aang', nacao: 'Nômades do Ar' }] } },
  },
]

function renderApp(rota) {
  return render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={[rota]}>
        <App />
      </MemoryRouter>
    </MockedProvider>,
  )
}

describe('App - rotas', () => {
  test('rota "/" renderiza a listagem de personagens', async () => {
    renderApp('/')

    expect(await screen.findByText(/carregando personagens/i)).toBeInTheDocument()
  })

  test('rota "/personagens/:id" renderiza a página de detalhe', () => {
    renderApp('/personagens/1')

    expect(screen.getByText(/detalhe do personagem 1/i)).toBeInTheDocument()
  })

  test('clicar em um card da listagem navega para a página de detalhe', async () => {
    renderApp('/')

    const link = await screen.findByRole('link', { name: /aang/i })
    fireEvent.click(link)

    expect(await screen.findByText(/detalhe do personagem 1/i)).toBeInTheDocument()
  })
})
