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
  imagem: '/personagens/aang.png',
}

const zukoMock = {
  id: '5',
  nome: 'Zuko',
  nacao: 'Nação do Fogo',
  idade: 16,
  historia: 'Príncipe exilado em busca da própria honra.',
  sonhos: 'Restaurar seu lugar na Nação do Fogo.',
  imagem: '/personagens/zuko.png',
}

const mocks = [
  {
    request: { query: PERSONAGENS_QUERY },
    result: {
      data: {
        personagens: [
          { id: '1', nome: 'Aang', nacao: 'Nômades do Ar', imagem: '/personagens/aang.png' },
        ],
      },
    },
  },
  {
    request: { query: PERSONAGEM_QUERY, variables: { id: '1' } },
    result: { data: { personagem: personagemMock } },
  },
  {
    request: { query: PERSONAGEM_QUERY, variables: { id: '5' } },
    result: { data: { personagem: zukoMock } },
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
  test('rota "/" renderiza o mural principal', async () => {
    renderApp('/')

    expect(await screen.findByRole('heading', { name: /mural do mundo de avatar/i })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Zuko' })).toBeInTheDocument()
  })

  test('rota "/mural" redireciona para o mural', async () => {
    renderApp('/mural')

    expect(await screen.findByRole('heading', { name: /mural do mundo de avatar/i })).toBeInTheDocument()
  })

  test('rota "/personagens" renderiza a listagem de personagens', async () => {
    renderApp('/personagens')

    expect(screen.getByText(/carregando personagens/i)).toBeInTheDocument()

    const link = await screen.findByRole('link', { name: /aang/i })
    expect(link).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /aang/i })).toHaveAttribute('src', '/personagens/aang.png')
  })

  test('rota "/personagens/:id" renderiza os dados do personagem', async () => {
    renderApp('/personagens/1')

    expect(await screen.findByRole('heading', { name: 'Aang' })).toBeInTheDocument()
    expect(screen.getByText('Nômades do Ar')).toBeInTheDocument()
    expect(screen.getByText(/12 anos/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /aang/i })).toHaveAttribute('src', '/personagens/aang.png')
  })

  test('clicar em um card da listagem navega para a página de detalhe', async () => {
    renderApp('/personagens')

    const link = await screen.findByRole('link', { name: /aang/i })
    fireEvent.click(link)

    expect(await screen.findByRole('link', { name: /voltar para a listagem/i })).toBeInTheDocument()
    expect(screen.getByText(/12 anos/i)).toBeInTheDocument()
  })
})
