import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing/react'
import { GraphQLError } from 'graphql'
import { beforeEach, describe, expect, test } from 'vitest'
import { CHAVE_ARMAZENAMENTO } from './utils/autenticacao.js'
import App from './App.jsx'
import {
  PERSONAGENS_QUERY,
  PERSONAGEM_QUERY,
  CRIAR_CONTA_MUTATION,
  LOGIN_MUTATION,
  FAVORITAR_MUTATION,
  DESFAVORITAR_MUTATION,
  MEUS_FAVORITOS_QUERY,
} from './graphql/queries.js'

const personagemMock = {
  __typename: 'Personagem',
  id: '1',
  nome: 'Aang',
  nacao: 'Nômades do Ar',
  idade: 12,
  historia: 'Último Nômade do Ar.',
  sonhos: 'Trazer equilíbrio ao mundo.',
  imagem: '/personagens/aang.png',
  favoritado: false,
}

const zukoMock = {
  __typename: 'Personagem',
  id: '5',
  nome: 'Zuko',
  nacao: 'Nação do Fogo',
  idade: 16,
  historia: 'Príncipe exilado em busca da própria honra.',
  sonhos: 'Restaurar seu lugar na Nação do Fogo.',
  imagem: '/personagens/zuko.png',
  favoritado: false,
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

function renderApp(rota, mocksExtras = []) {
  return render(
    <MockedProvider mocks={[...mocks, ...mocksExtras]}>
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

const usuarioMock = { id: 'u1', email: 'ana@teste.com' }

describe('App - cadastro e login', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('cadastro cria conta e autentica automaticamente', async () => {
    const mocksExtras = [
      {
        request: { query: CRIAR_CONTA_MUTATION, variables: { email: 'ana@teste.com', senha: 'senha-valida-123' } },
        result: { data: { criarConta: { token: 'token-fake', usuario: usuarioMock } } },
      },
    ]
    renderApp('/cadastro', mocksExtras)

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'ana@teste.com' } })
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha-valida-123' } })
    fireEvent.click(screen.getByRole('button', { name: /criar conta/i }))

    expect(await screen.findByText('ana@teste.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
  })

  test('login com credenciais corretas autentica e reflete no cabeçalho', async () => {
    const mocksExtras = [
      {
        request: { query: LOGIN_MUTATION, variables: { email: 'ana@teste.com', senha: 'senha-valida-123' } },
        result: { data: { login: { token: 'token-fake', usuario: usuarioMock } } },
      },
    ]
    renderApp('/login', mocksExtras)

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'ana@teste.com' } })
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha-valida-123' } })
    fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }))

    expect(await screen.findByText('ana@teste.com')).toBeInTheDocument()
  })

  test('login com senha errada mostra mensagem de erro', async () => {
    const mocksExtras = [
      {
        request: { query: LOGIN_MUTATION, variables: { email: 'ana@teste.com', senha: 'senha-errada' } },
        result: {
          errors: [
            new GraphQLError('E-mail ou senha inválidos.', { extensions: { code: 'CREDENCIAIS_INVALIDAS' } }),
          ],
        },
      },
    ]
    renderApp('/login', mocksExtras)

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'ana@teste.com' } })
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha-errada' } })
    fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/e-mail ou senha inválidos/i)
  })

  test('sair encerra a sessão e o cabeçalho volta ao estado deslogado', async () => {
    const mocksExtras = [
      {
        request: { query: LOGIN_MUTATION, variables: { email: 'ana@teste.com', senha: 'senha-valida-123' } },
        result: { data: { login: { token: 'token-fake', usuario: usuarioMock } } },
      },
    ]
    renderApp('/login', mocksExtras)

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'ana@teste.com' } })
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha-valida-123' } })
    fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }))

    await screen.findByText('ana@teste.com')

    fireEvent.click(screen.getByRole('button', { name: /sair/i }))

    await waitFor(() => expect(screen.getByRole('link', { name: /^entrar$/i })).toBeInTheDocument())
  })
})

function autenticarLocalmente() {
  localStorage.setItem(
    CHAVE_ARMAZENAMENTO,
    JSON.stringify({ token: 'token-fake', usuario: usuarioMock }),
  )
}

describe('App - favoritar personagens', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('botão de favoritar não aparece deslogado', async () => {
    renderApp('/personagens/1')

    await screen.findByRole('heading', { name: 'Aang' })
    expect(screen.queryByRole('button', { name: /favoritos/i })).not.toBeInTheDocument()
  })

  test('logado, favoritar muda o ícone na hora, sem recarregar a página', async () => {
    autenticarLocalmente()
    const mocksExtras = [
      {
        request: { query: FAVORITAR_MUTATION, variables: { personagemId: '1' } },
        result: { data: { favoritar: { id: '1', favoritado: true, __typename: 'Personagem' } } },
      },
    ]
    renderApp('/personagens/1', mocksExtras)

    await screen.findByRole('heading', { name: 'Aang' })
    const botao = screen.getByRole('button', { name: /adicionar aos favoritos/i })

    fireEvent.click(botao)

    expect(await screen.findByRole('button', { name: /remover dos favoritos/i })).toBeInTheDocument()
  })

  test('logado, desfavoritar reverte o ícone (clicar de novo no mesmo botão)', async () => {
    autenticarLocalmente()
    const mocksExtras = [
      {
        request: { query: FAVORITAR_MUTATION, variables: { personagemId: '1' } },
        result: { data: { favoritar: { id: '1', favoritado: true, __typename: 'Personagem' } } },
      },
      {
        request: { query: DESFAVORITAR_MUTATION, variables: { personagemId: '1' } },
        result: { data: { desfavoritar: { id: '1', favoritado: false, __typename: 'Personagem' } } },
      },
    ]
    renderApp('/personagens/1', mocksExtras)

    await screen.findByRole('heading', { name: 'Aang' })
    fireEvent.click(screen.getByRole('button', { name: /adicionar aos favoritos/i }))

    const botaoAtivo = await screen.findByRole('button', { name: /remover dos favoritos/i })
    await waitFor(() => expect(botaoAtivo).not.toBeDisabled())
    fireEvent.click(botaoAtivo)

    expect(await screen.findByRole('button', { name: /adicionar aos favoritos/i })).toBeInTheDocument()
  })

  test('/favoritos sem login redireciona para /login', async () => {
    renderApp('/favoritos')

    expect(await screen.findByRole('heading', { name: /entrar/i })).toBeInTheDocument()
  })

  test('/favoritos logado lista os personagens favoritados', async () => {
    autenticarLocalmente()
    const mocksExtras = [
      {
        request: { query: MEUS_FAVORITOS_QUERY },
        result: {
          data: {
            meusFavoritos: [
              { id: '1', nome: 'Aang', nacao: 'Nômades do Ar', imagem: '/personagens/aang.png' },
            ],
          },
        },
      },
    ]
    renderApp('/favoritos', mocksExtras)

    expect(await screen.findByRole('link', { name: /aang/i })).toBeInTheDocument()
  })

  test('/favoritos logado sem favoritos mostra mensagem de lista vazia', async () => {
    autenticarLocalmente()
    const mocksExtras = [
      {
        request: { query: MEUS_FAVORITOS_QUERY },
        result: { data: { meusFavoritos: [] } },
      },
    ]
    renderApp('/favoritos', mocksExtras)

    expect(await screen.findByText(/você ainda não favoritou nenhum personagem/i)).toBeInTheDocument()
  })
})
