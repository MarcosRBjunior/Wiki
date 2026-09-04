import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { motion } from 'framer-motion'
import { PERSONAGEM_QUERY } from '../graphql/queries.js'
import { AvatarPersonagem } from '../components/AvatarPersonagem.jsx'
import { NACOES_FILTRO } from '../utils/nacao.js'

const NACOES_MURAL = [
  {
    categoria: 'agua',
    nome: 'Tribo da Água',
    corVar: '--cor-agua',
    resumo: 'Dividida entre o Polo Sul, o Polo Norte e os dobradores do Pântano. A dobra d’água segue o ritmo da Lua e do Oceano, alternando entre cura e combate.',
  },
  {
    categoria: 'terra',
    nome: 'Reino da Terra',
    corVar: '--cor-terra',
    resumo: 'O maior território do mundo, de Ba Sing Se a Omashu e à Ilha Kyoshi. A dobra de terra valoriza firmeza e paciência — até virar metal ou lava nas mãos certas.',
  },
  {
    categoria: 'fogo',
    nome: 'Nação do Fogo',
    corVar: '--cor-fogo',
    resumo: 'Nação insular industrializada, motor da guerra dos cem anos. A dobra de fogo nasce da respiração e do domínio interior — no auge, chega ao relâmpago.',
  },
  {
    categoria: 'ar',
    nome: 'Nômades do Ar',
    corVar: '--cor-ar',
    resumo: 'Povo nômade e pacifista, extinto pela Nação do Fogo, vivia em templos nos picos mais altos do mundo. A dobra de ar é a mais livre e evasiva de todas.',
  },
]

const LUGARES = [
  { nome: 'Ba Sing Se', nacao: 'terra', descricao: 'Capital murada do Reino da Terra, dividida em anéis concêntricos e vigiada pela sinistra Polícia Secreta Dai Li.' },
  { nome: 'Omashu', nacao: 'terra', descricao: 'Cidade-montanha erguida em terraços, famosa pelo sistema de tobogãs usado como correio e transporte.' },
  { nome: 'Ilha Kyoshi', nacao: 'terra', descricao: 'Vila costeira isolada do Reino da Terra, lar das Guerreiras Kyoshi e da comunidade de criadores de leão-tartaruga.' },
  { nome: 'Templo do Ar do Sul', nacao: 'ar', descricao: 'Santuário no topo das montanhas onde Aang foi criado pelo Monge Gyatso, encontrado séculos depois já em ruínas.' },
  { nome: 'Tribo da Água do Norte', nacao: 'agua', descricao: 'Cidade-fortaleza polar construída sobre um oásis, protegida pelos Espíritos da Lua e do Oceano.' },
  { nome: 'Tribo da Água do Sul', nacao: 'agua', descricao: 'Pequeno vilarejo devastado por décadas de ataques da Nação do Fogo, lar de Katara, Sokka e Hakoda.' },
  { nome: 'Capital da Nação do Fogo', nacao: 'fogo', descricao: 'Ilha vulcânica sede do trono do Senhor do Fogo, cercada pela caldeira que dá forma à cidade.' },
  { nome: 'Pântano Enevoado', nacao: 'agua', descricao: 'Território isolado no Reino da Terra, lar de uma comunidade própria de dobradores de água ligados por raízes espirituais.' },
]

const CELEBRACOES = [
  { titulo: 'Festival da Lua Cheia', descricao: 'Celebração da Tribo da Água do Norte em honra ao Espírito da Lua, guardião da dobra de água.' },
  { titulo: 'A Peça dos Atores de Ember Island', descricao: 'Encenação teatral popular na Nação do Fogo que reconta — com bastante liberdade — a jornada do Avatar.' },
  { titulo: 'Provas de Mestria', descricao: 'Ritos de passagem como o exame de Katara perante o Mestre Pakku, que marcam a virada de aprendiz a mestre dobrador.' },
]

const DATAS_MARCANTES = [
  { titulo: 'Solstício de Inverno', descricao: 'Único dia em que o Templo do Avatar Roku se abre, permitindo contato com vidas passadas.' },
  { titulo: 'Dia do Sol Negro', descricao: 'Eclipse solar que anula temporariamente a dobra de fogo — usado pela Aliança para invadir a Nação do Fogo.' },
  { titulo: 'Cometa de Sozin', descricao: 'Evento centenário que amplifica drasticamente o poder dos dominadores de fogo, decisivo na batalha final.' },
  { titulo: 'Genocídio dos Nômades do Ar', descricao: 'Marco histórico que divide o calendário da série entre o "antes" e o "depois" da guerra de cem anos.' },
]

const PERSONAGENS_PRINCIPAIS = [
  { id: '1', nome: 'Aang' },
  { id: '2', nome: 'Katara' },
  { id: '3', nome: 'Sokka' },
  { id: '4', nome: 'Toph Beifong' },
  { id: '5', nome: 'Zuko' },
  { id: '6', nome: 'Iroh' },
]

const AVATARES_ANTERIORES = [
  { id: '18', nome: 'Avatar Roku' },
  { id: '19', nome: 'Avatar Kyoshi' },
]

const secao = {
  oculto: { opacity: 0, y: 16 },
  visivel: { opacity: 1, y: 0 },
}

function Divisor() {
  return (
    <div className="divisor mural__divisor">
      <span className="divisor__marca" />
    </div>
  )
}

function DestaquePersonagem() {
  const { data, loading, error } = useQuery(PERSONAGEM_QUERY, { variables: { id: '5' } })

  if (loading || error || !data?.personagem) return null

  const { id, nome, nacao, historia, imagem } = data.personagem

  return (
    <motion.section
      className="mural__bloco mural__bloco--destaque"
      variants={secao}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, amount: 0.3 }}
    >
      <p className="mural__olho">Conteúdo em destaque</p>
      <div className="mural__destaque-corpo">
        <AvatarPersonagem nome={nome} imagem={imagem} nacao={nacao} className="mural__destaque-avatar" />
        <div>
          <h2>{nome}</h2>
          <p className="mural__destaque-texto">{historia}</p>
          <Link to={`/personagens/${id}`} className="mural__link">Ver perfil completo →</Link>
        </div>
      </div>
    </motion.section>
  )
}

export function MuralPrincipal() {
  return (
    <div className="mural">
      <motion.header
        className="mural__hero"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="cabecalho__emblema mural__emblema" aria-hidden="true">
          <span className="cabecalho__emblema-ponto" />
        </span>
        <h1>Mural do Mundo de Avatar</h1>
        <p>Lugares, celebrações e datas que marcam a jornada de Aang pelas Quatro Nações.</p>
      </motion.header>

      <DestaquePersonagem />
      <Divisor />

      <motion.section
        className="mural__bloco"
        variants={secao}
        initial="oculto"
        whileInView="visivel"
        viewport={{ once: true, amount: 0.2 }}
      >
        <p className="mural__olho">As quatro nações</p>
        <div className="mural__nacoes">
          {NACOES_MURAL.map(({ categoria, nome, corVar, resumo }, indice) => (
            <article
              key={categoria}
              className={`mural__nacao-card${indice % 2 ? ' mural__nacao-card--invertido' : ''}`}
              style={{ '--cor-nacao-atual': `var(${corVar})` }}
            >
              <span className="mural__nacao-icone" aria-hidden="true">
                <svg><use href={`#icon-${categoria}`} /></svg>
              </span>
              <div>
                <h3>{nome}</h3>
                <p>{resumo}</p>
                <Link to={`/?nacao=${categoria}`} className="mural__link">
                  Ver personagens →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      <Divisor />

      <motion.section
        className="mural__bloco"
        variants={secao}
        initial="oculto"
        whileInView="visivel"
        viewport={{ once: true, amount: 0.2 }}
      >
        <p className="mural__olho">Lugares do mundo de Avatar</p>
        <div className="mural__grade-cards">
          {LUGARES.map(({ nome, nacao, descricao }) => (
            <article key={nome} className="mural__card" style={{ '--cor-nacao-atual': `var(--cor-${nacao})` }}>
              <span className="selo-nacao">
                <svg aria-hidden="true"><use href={`#icon-${nacao}`} /></svg>
                {NACOES_FILTRO.find((n) => n.categoria === nacao)?.rotulo}
              </span>
              <h3>{nome}</h3>
              <p>{descricao}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <Divisor />

      <motion.section
        className="mural__bloco"
        variants={secao}
        initial="oculto"
        whileInView="visivel"
        viewport={{ once: true, amount: 0.2 }}
      >
        <p className="mural__olho">Festas e celebrações</p>
        <div className="mural__grade-cards">
          {CELEBRACOES.map(({ titulo, descricao }) => (
            <article key={titulo} className="mural__card">
              <h3>{titulo}</h3>
              <p>{descricao}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <Divisor />

      <motion.section
        className="mural__bloco"
        variants={secao}
        initial="oculto"
        whileInView="visivel"
        viewport={{ once: true, amount: 0.2 }}
      >
        <p className="mural__olho">Datas marcantes</p>
        <ol className="mural__linha-tempo">
          {DATAS_MARCANTES.map(({ titulo, descricao }) => (
            <li key={titulo}>
              <span className="mural__linha-tempo-marca" aria-hidden="true" />
              <div>
                <h3>{titulo}</h3>
                <p>{descricao}</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      <Divisor />

      <motion.section
        className="mural__bloco"
        variants={secao}
        initial="oculto"
        whileInView="visivel"
        viewport={{ once: true, amount: 0.2 }}
      >
        <p className="mural__olho">Personagens principais</p>
        <div className="mural__atalhos">
          {PERSONAGENS_PRINCIPAIS.map(({ id, nome }) => (
            <Link key={id} to={`/personagens/${id}`} className="mural__atalho">
              {nome}
            </Link>
          ))}
        </div>
        <p className="mural__olho mural__olho--sub">Avatares anteriores</p>
        <div className="mural__atalhos">
          {AVATARES_ANTERIORES.map(({ id, nome }) => (
            <Link key={id} to={`/personagens/${id}`} className="mural__atalho">
              {nome}
            </Link>
          ))}
        </div>
      </motion.section>

      <Divisor />

      <motion.section
        className="mural__bloco mural__bloco--comunidade"
        variants={secao}
        initial="oculto"
        whileInView="visivel"
        viewport={{ once: true, amount: 0.3 }}
      >
        <p className="mural__olho">Comunidade e contribuição</p>
        <p>Esta wiki é um projeto de fã em construção. Encontrou algo faltando ou quer sugerir uma página?</p>
        <a
          href="https://github.com/MarcosRBjunior/Wiki"
          target="_blank"
          rel="noreferrer"
          className="mural__link"
        >
          Contribua no repositório →
        </a>
      </motion.section>
    </div>
  )
}
