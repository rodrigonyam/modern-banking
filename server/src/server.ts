import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { registerRoutes } from './routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  registerRoutes(app);

  app.use((req, res) => {
    res
      .status(404)
      .json({ error: `Route not found: ${req.method} ${req.path}` });
  });

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      const status =
        err instanceof Error && 'status' in err ? (err as any).status : 500;
      res.status(status).json({ error: message });
    }
  );

  return app;
}
