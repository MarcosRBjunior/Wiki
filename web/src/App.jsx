import { Routes, Route } from 'react-router-dom'
import { ListaPersonagens } from './pages/ListaPersonagens.jsx'
import { PersonagemDetalhe } from './pages/PersonagemDetalhe.jsx'

function App() {
  return (
    <>
      <h1>Wiki de Fãs — Avatar: A Lenda de Aang</h1>
      <Routes>
        <Route path="/" element={<ListaPersonagens />} />
        <Route path="/personagens/:id" element={<PersonagemDetalhe />} />
      </Routes>
    </>
  )
}

export default App
