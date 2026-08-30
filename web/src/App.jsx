import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Cabecalho } from './components/Cabecalho.jsx'
import { ListaPersonagens } from './pages/ListaPersonagens.jsx'
import { PersonagemDetalhe } from './pages/PersonagemDetalhe.jsx'

function App() {
  const location = useLocation()

  return (
    <>
      <Cabecalho />
      <main className="conteudo">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Routes location={location}>
              <Route path="/" element={<ListaPersonagens />} />
              <Route path="/personagens/:id" element={<PersonagemDetalhe />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  )
}

export default App
