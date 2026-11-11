import { Router } from 'express';
import { questionController as ctrl } from '../controllers/question.controller.js';
import { validate } from '../middlewares/validate.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';
import { idParamSchema, questionBodySchema } from '../validators/question.schema.js';

// Público: lo consume la burbuja del chatbot (solo preguntas activas)
export const publicQuestionRouter = Router();
publicQuestionRouter.get('/', ctrl.listPublic);

// Administración: protegido con el header x-api-key
export const adminQuestionRouter = Router();
adminQuestionRouter.use(requireAdmin);
adminQuestionRouter.get('/', ctrl.listAll);
adminQuestionRouter.get('/:id', validate(idParamSchema, 'params'), ctrl.getById);
adminQuestionRouter.post('/', validate(questionBodySchema), ctrl.create);
adminQuestionRouter.put('/:id', validate(idParamSchema, 'params'), validate(questionBodySchema), ctrl.update);
adminQuestionRouter.delete('/:id', validate(idParamSchema, 'params'), ctrl.remove);
