import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from './db.js';

const SALT_ROUNDS = 10;

export function buscarUsuarioPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email) ?? null;
}

export function buscarUsuarioPorId(id) {
  return db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id) ?? null;
}

export function criarUsuario({ email, senha }) {
  const usuario = {
    id: crypto.randomUUID(),
    email,
    senha_hash: bcrypt.hashSync(senha, SALT_ROUNDS),
    criado_em: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO usuarios (id, email, senha_hash, criado_em)
    VALUES (@id, @email, @senha_hash, @criado_em)
  `).run(usuario);

  return usuario;
}

export function verificarSenha(usuario, senha) {
  return bcrypt.compareSync(senha, usuario.senha_hash);
}
