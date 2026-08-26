import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'personagens.db');

export const db = new Database(DB_FILE);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS personagens (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    nacao TEXT NOT NULL,
    idade INTEGER NOT NULL,
    historia TEXT NOT NULL,
    sonhos TEXT NOT NULL,
    imagem TEXT NOT NULL
  )
`);
