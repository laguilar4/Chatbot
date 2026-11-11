import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { publicQuestionRouter, adminQuestionRouter } from './routes/question.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json({ limit: '100kb' }));
app.use(
  '/api',
  rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }),
);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/questions', publicQuestionRouter);
app.use('/api/admin/questions', adminQuestionRouter);

app.use(notFoundHandler);
app.use(errorHandler);
