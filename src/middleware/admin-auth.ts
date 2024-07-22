import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtAuthPayload, RequestWithUser } from '../types/api';
import config from '../config/config';

// Middleware to extract and verify token

export const authGuard = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const escapedRoutes = ['/auth/forgot', '/auth/login', '/auth/reset', '/auth/verify'];

    if (escapedRoutes.includes(req.path)) return next();

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, config.jwt.secret as string) as JwtAuthPayload;
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware to check user role
export const roleGuard = (requiredRole: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user as JwtAuthPayload;

    if (!requiredRole.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
