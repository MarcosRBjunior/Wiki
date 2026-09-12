import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';
import bcrypt from 'bcryptjs';
import { db } from './db.js';

const SALT_ROUNDS = 10;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAMINHO_WORKER = path.join(__dirname, 'bcryptWorker.js');

// Usado quando o e-mail não existe, pra login() gastar o mesmo tempo de bcrypt
// que gastaria comparando uma senha real — sem isso, dá pra descobrir por
// timing quais e-mails estão cadastrados.
const HASH_FALSO = bcrypt.hashSync(crypto.randomUUID(), SALT_ROUNDS);

// Roda o hash/compare do bcrypt numa worker thread nova por chamada,
// terminada assim que a resposta chega — evita manter uma worker persistente
// que impediria o processo de encerrar sozinho (`npm test`/`npm run dev`).
function calcularComBcryptWorker(mensagem) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(CAMINHO_WORKER);

    worker.once('message', ({ resultado, erro }) => {
      worker.terminate();
      if (erro) reject(new Error(erro));
      else resolve(resultado);
    });

    worker.once('error', (erro) => {
      worker.terminate();
      reject(erro);
    });

    worker.postMessage(mensagem);
  });
}

function normalizarEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : email;
}

export function buscarUsuarioPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(normalizarEmail(email)) ?? null;
}

export async function criarUsuario({ email, senha }) {
  const usuario = {
    id: crypto.randomUUID(),
    email: normalizarEmail(email),
    senha_hash: await calcularComBcryptWorker({ tipo: 'hash', senha, saltRounds: SALT_ROUNDS }),
    criado_em: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO usuarios (id, email, senha_hash, criado_em)
    VALUES (@id, @email, @senha_hash, @criado_em)
  `).run(usuario);

  return usuario;
}

export async function verificarSenha(usuario, senha) {
  const hash = usuario ? usuario.senha_hash : HASH_FALSO;
  return calcularComBcryptWorker({ tipo: 'compare', senha, hash });
}
