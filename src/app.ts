import 'dotenv/config';
import 'express-async-errors';

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errors } from 'celebrate';
import path from 'path';
import { isBoom } from '@hapi/boom';

import routes from './routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use('/v1', routes);

app.use(errors());
app.use((err: Error, _: Request, response: Response, next: Function) => {
  if (isBoom(err)) {
    const { statusCode, payload } = err.output;

    return response.status(statusCode).json({
      ...payload,
      ...err.data,
      docs: process.env.DOCS_URL,
    });
  }

  return next(err);
});

export default app;
