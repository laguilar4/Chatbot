import { request } from './httpClient';

const adminHeaders = (apiKey) => ({ 'x-api-key': apiKey });

export const questionsApi = {
  // Público (chatbot)
  listPublic: (signal) => request('/questions', { signal }),

  // Administración
  listAll: (apiKey, signal) => request('/admin/questions', { headers: adminHeaders(apiKey), signal }),
  create: (apiKey, data) => request('/admin/questions', { method: 'POST', body: data, headers: adminHeaders(apiKey) }),
  update: (apiKey, id, data) =>
    request(`/admin/questions/${id}`, { method: 'PUT', body: data, headers: adminHeaders(apiKey) }),
  remove: (apiKey, id) => request(`/admin/questions/${id}`, { method: 'DELETE', headers: adminHeaders(apiKey) }),
};
