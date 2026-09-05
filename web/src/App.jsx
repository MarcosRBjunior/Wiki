import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Cabecalho } from './components/Cabecalho.jsx'
import { IconesNacao } from './components/IconesNacao.jsx'
import { ListaPersonagens } from './pages/ListaPersonagens.jsx'
import { PersonagemDetalhe } from './pages/PersonagemDetalhe.jsx'
import { MuralPrincipal } from './pages/MuralPrincipal.jsx'
import { NaoEncontrada } from './pages/NaoEncontrada.jsx'
import { ROTA_MURAL, ROTA_PERSONAGENS } from './utils/rotas.js'

function App() {
  const location = useLocation()

  return (
    <>
      <IconesNacao />
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
              <Route path={ROTA_MURAL} element={<MuralPrincipal />} />
              <Route path={ROTA_PERSONAGENS} element={<ListaPersonagens />} />
              <Route path={`${ROTA_PERSONAGENS}/:id`} element={<PersonagemDetalhe />} />
              <Route path="/mural" element={<Navigate to={ROTA_MURAL} replace />} />
              <Route path="*" element={<NaoEncontrada />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  )
}

export default App
