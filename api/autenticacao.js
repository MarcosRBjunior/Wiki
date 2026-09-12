import jwt from 'jsonwebtoken';

const SEGREDO = process.env.JWT_SECRET;

if (!SEGREDO) {
  throw new Error(
    'JWT_SECRET não definido. Configure essa variável de ambiente antes de subir a API (ver .env.example).',
  );
}

const EXPIRACAO = '7d';

export function assinarToken(usuarioId) {
  return jwt.sign({ usuarioId }, SEGREDO, { expiresIn: EXPIRACAO });
}

export function verificarToken(token) {
  try {
    return jwt.verify(token, SEGREDO).usuarioId;
  } catch {
    return null;
  }
}
