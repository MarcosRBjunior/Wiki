import { db } from './db.js';
import { buscarPersonagens as buscarPersonagensDaFonte } from './personagensRepository.js';

function contarPersonagens() {
  return db.prepare('SELECT COUNT(*) AS total FROM personagens').get().total;
}

export async function seedSeNecessario() {
  if (contarPersonagens() > 0) return;

  const personagens = await buscarPersonagensDaFonte();
  const inserir = db.prepare(`
    INSERT INTO personagens (id, nome, nacao, idade, historia, sonhos, imagem)
    VALUES (@id, @nome, @nacao, @idade, @historia, @sonhos, @imagem)
  `);

  const inserirTodos = db.transaction((lista) => {
    for (const personagem of lista) inserir.run(personagem);
  });
  inserirTodos(personagens);
}

export function listarPersonagens() {
  return db.prepare('SELECT * FROM personagens ORDER BY nome').all();
}

export function buscarPersonagemPorId(id) {
  return db.prepare('SELECT * FROM personagens WHERE id = ?').get(id) ?? null;
}
