import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'personagens.json');

let cache = null;

async function carregarPersonagens() {
  if (!cache) {
    const conteudo = await readFile(DATA_FILE, 'utf-8');
    cache = JSON.parse(conteudo);
  }
  return cache.map((personagem) => ({ ...personagem }));
}

export async function buscarPersonagens() {
  return carregarPersonagens();
}

export async function buscarPersonagemPorIdNaFonte(id) {
  const personagens = await carregarPersonagens();
  return personagens.find((personagem) => personagem.id === id) ?? null;
}
