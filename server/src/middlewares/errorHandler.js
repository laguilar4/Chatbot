import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

export function notFoundHandler(req, _res, next) {
  next(HttpError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado' });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  console.error(err);
  res.status(500).json({
    error: 'Error interno del servidor',
    ...(!env.isProduction && { debug: err.message }),
  });
}
