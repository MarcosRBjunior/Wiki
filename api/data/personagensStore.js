import { db } from './db.js';
import { buscarPersonagens as buscarPersonagensDaFonte } from './personagensRepository.js';

export async function seedSeNecessario() {
  const personagens = await buscarPersonagensDaFonte();
  const inserir = db.prepare(`
    INSERT OR IGNORE INTO personagens (id, nome, nacao, idade, historia, sonhos, imagem)
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
