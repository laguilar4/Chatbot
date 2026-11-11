import { API_URL } from '../config';

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** Wrapper de fetch: JSON por defecto, manejo de errores uniforme y soporte de AbortSignal. */
export async function request(path, { method = 'GET', body, headers, signal } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    signal,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? `Error ${res.status}`, data?.details);
  }
  return data;
}
