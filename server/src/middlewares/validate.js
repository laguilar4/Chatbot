import { HttpError } from '../utils/HttpError.js';

/**
 * Valida req[source] con un esquema Zod.
 * El dato saneado se guarda en req.validated[source] (en Express 5 req.query es de solo lectura).
 */
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source] ?? {});
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    return next(HttpError.badRequest('Datos inválidos', details));
  }
  req.validated = { ...req.validated, [source]: result.data };
  next();
};
