import { Routes, Route } from 'react-router-dom'
import { Cabecalho } from './components/Cabecalho.jsx'
import { ListaPersonagens } from './pages/ListaPersonagens.jsx'
import { PersonagemDetalhe } from './pages/PersonagemDetalhe.jsx'

function App() {
  return (
    <>
      <Cabecalho />
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<ListaPersonagens />} />
          <Route path="/personagens/:id" element={<PersonagemDetalhe />} />
        </Routes>
      </main>
    </>
  )
}

export default App
