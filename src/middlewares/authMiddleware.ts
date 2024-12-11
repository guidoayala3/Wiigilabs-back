import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/responseUtil';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization'];

  if (!token) {
    sendResponse(res, 401, { message: 'Authorization token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET!);
    (req as any).user = decoded; 
    next();
  } catch (error) {
    sendResponse(res, 401, { message: 'Invalid token' });
  }
};
