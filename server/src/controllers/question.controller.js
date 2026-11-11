import { questionService } from '../services/question.service.js';

// Express 5 propaga automáticamente los errores de funciones async al errorHandler.
export const questionController = {
  async listPublic(_req, res) {
    res.json(await questionService.listPublic());
  },

  async listAll(_req, res) {
    res.json(await questionService.listAll());
  },

  async getById(req, res) {
    res.json(await questionService.getById(req.validated.params.id));
  },

  async create(req, res) {
    const question = await questionService.create(req.validated.body);
    res.status(201).location(`/api/admin/questions/${question.id}`).json(question);
  },

  async update(req, res) {
    res.json(await questionService.update(req.validated.params.id, req.validated.body));
  },

  async remove(req, res) {
    await questionService.remove(req.validated.params.id);
    res.status(204).end();
  },
};
