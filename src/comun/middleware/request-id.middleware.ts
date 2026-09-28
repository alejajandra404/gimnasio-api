import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Request-Id', randomUUID());
  next();
}
