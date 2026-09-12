import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from './db.js';

const SALT_ROUNDS = 10;

// Usado quando o e-mail não existe, pra login() gastar o mesmo tempo de bcrypt
// que gastaria comparando uma senha real — sem isso, dá pra descobrir por
// timing quais e-mails estão cadastrados.
const HASH_FALSO = bcrypt.hashSync(crypto.randomUUID(), SALT_ROUNDS);

function normalizarEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : email;
}

export function buscarUsuarioPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(normalizarEmail(email)) ?? null;
}

export function criarUsuario({ email, senha }) {
  const usuario = {
    id: crypto.randomUUID(),
    email: normalizarEmail(email),
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
  const hash = usuario ? usuario.senha_hash : HASH_FALSO;
  return bcrypt.compareSync(senha, hash);
}
