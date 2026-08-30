import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing/react'
import { describe, expect, test } from 'vitest'
import App from './App.jsx'
import { PERSONAGENS_QUERY, PERSONAGEM_QUERY } from './graphql/queries.js'

const personagemMock = {
  id: '1',
  nome: 'Aang',
  nacao: 'Nômades do Ar',
  idade: 12,
  historia: 'Último Nômade do Ar.',
  sonhos: 'Trazer equilíbrio ao mundo.',
}

const mocks = [
  {
    request: { query: PERSONAGENS_QUERY },
    result: { data: { personagens: [{ id: '1', nome: 'Aang', nacao: 'Nômades do Ar' }] } },
  },
  {
    request: { query: PERSONAGEM_QUERY, variables: { id: '1' } },
    result: { data: { personagem: personagemMock } },
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

  test('rota "/personagens/:id" renderiza os dados do personagem', async () => {
    renderApp('/personagens/1')

    expect(await screen.findByRole('heading', { name: 'Aang' })).toBeInTheDocument()
    expect(screen.getByText(/nômades do ar · 12 anos/i)).toBeInTheDocument()
  })

  test('clicar em um card da listagem navega para a página de detalhe', async () => {
    renderApp('/')

    const link = await screen.findByRole('link', { name: /aang/i })
    fireEvent.click(link)

    expect(await screen.findByText(/nômades do ar · 12 anos/i)).toBeInTheDocument()
  })
})
