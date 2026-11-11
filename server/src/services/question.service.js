import { questionRepository } from '../repositories/question.repository.js';
import { HttpError } from '../utils/HttpError.js';

async function withDuplicateCheck(fn, optionNumber) {
  try {
    return await fn();
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw HttpError.conflict(`Ya existe una pregunta con el número ${optionNumber}`);
    }
    throw err;
  }
}

export const questionService = {
  listPublic: () => questionRepository.findActive(),

  listAll: () => questionRepository.findAll(),

  async getById(id) {
    const question = await questionRepository.findById(id);
    if (!question) throw HttpError.notFound('Pregunta no encontrada');
    return question;
  },

  async create(data) {
    const id = await withDuplicateCheck(() => questionRepository.create(data), data.optionNumber);
    return questionRepository.findById(id);
  },

  async update(id, data) {
    const updated = await withDuplicateCheck(() => questionRepository.update(id, data), data.optionNumber);
    if (!updated) throw HttpError.notFound('Pregunta no encontrada');
    return questionRepository.findById(id);
  },

  async remove(id) {
    const removed = await questionRepository.remove(id);
    if (!removed) throw HttpError.notFound('Pregunta no encontrada');
  },
};
