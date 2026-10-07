import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  // Si el cliente ya mando un X-Request-Id lo respetamos; si no, uno nuevo.
  const id = (req.headers['x-request-id'] as string) ?? randomUUID();
  res.setHeader('X-Request-Id', id);
  next();
}
