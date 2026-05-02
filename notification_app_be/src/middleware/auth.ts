import { Request, Response, NextFunction } from 'express';
import { logError } from 'logging-middleware';

// Store token globally (from registration)
let globalAuthToken: string | null = null;

export function setAuthToken(token: string) {
  globalAuthToken = token;
}

export async function verifyAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    await logError('backend', 'middleware', 'Missing or invalid authorization header');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  if (!globalAuthToken || token !== globalAuthToken) {
    await logError('backend', 'middleware', 'Invalid token provided');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}