import { Application } from 'express';
import accountsRouter from './accounts';
import healthRouter from './health';

export function registerRoutes(app: Application) {
  app.use('/healthz', healthRouter);
  app.use('/api/accounts', accountsRouter);
}
