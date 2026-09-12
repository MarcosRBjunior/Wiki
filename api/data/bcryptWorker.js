import { parentPort } from 'node:worker_threads';
import bcrypt from 'bcryptjs';

// bcryptjs só cede o event loop da própria thread entre rounds quando o
// cálculo passa de 100ms; com o custo usado aqui (~55-60ms) ele roda de uma
// vez, síncrono. Rodando isso numa worker thread descartável (uma por
// chamada), quem fica preso é só ela — a thread principal, que atende as
// outras requisições, continua livre.
parentPort.once('message', async ({ tipo, senha, hash, saltRounds }) => {
  try {
    const resultado =
      tipo === 'hash' ? await bcrypt.hash(senha, saltRounds) : await bcrypt.compare(senha, hash);
    parentPort.postMessage({ resultado });
  } catch (erro) {
    parentPort.postMessage({ erro: erro.message });
  }
});
