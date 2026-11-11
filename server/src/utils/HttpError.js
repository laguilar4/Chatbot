export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }

  static badRequest(msg = 'Solicitud inválida', details) {
    return new HttpError(400, msg, details);
  }

  static unauthorized(msg = 'No autorizado') {
    return new HttpError(401, msg);
  }

  static notFound(msg = 'Recurso no encontrado') {
    return new HttpError(404, msg);
  }

  static conflict(msg = 'Conflicto') {
    return new HttpError(409, msg);
  }
}
