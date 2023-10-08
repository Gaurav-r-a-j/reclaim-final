// Import necessary modules and types
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import env from '../util/validateEnv';

// Define the TokenPayload interface
interface TokenPayload {
  userId: string; // Change the type as needed
  // Add other properties as needed
}

// Extend the Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string; // Change the type as needed
    }
  }
}

// Create the requiresAuth middleware
export const requiresAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token not provided' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid access token' });
  }
};
