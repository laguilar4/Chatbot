import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

const expected = Buffer.from(env.ADMIN_API_KEY);

export function requireAdmin(req, _res, next) {
  const provided = Buffer.from(req.get('x-api-key') ?? '');
  // Comparación en tiempo constante para evitar timing attacks
  const valid = provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
  if (!valid) return next(HttpError.unauthorized('Clave de administrador inválida'));
  next();
}
