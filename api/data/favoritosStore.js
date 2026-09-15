import { db } from './db.js';

export function estaFavoritado(usuarioId, personagemId) {
  const linha = db
    .prepare('SELECT 1 FROM favoritos WHERE usuario_id = ? AND personagem_id = ?')
    .get(usuarioId, personagemId);
  return linha !== undefined;
}

export function marcarFavorito(usuarioId, personagemId) {
  db.prepare(
    'INSERT OR IGNORE INTO favoritos (usuario_id, personagem_id) VALUES (?, ?)',
  ).run(usuarioId, personagemId);
}

export function desmarcarFavorito(usuarioId, personagemId) {
  db.prepare('DELETE FROM favoritos WHERE usuario_id = ? AND personagem_id = ?').run(
    usuarioId,
    personagemId,
  );
}

export function listarFavoritos(usuarioId) {
  return db
    .prepare(
      `SELECT p.* FROM personagens p
       JOIN favoritos f ON f.personagem_id = p.id
       WHERE f.usuario_id = ?
       ORDER BY p.nome`,
    )
    .all(usuarioId);
}
