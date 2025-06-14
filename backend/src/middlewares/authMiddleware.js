// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'justevents-secret';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      console.log("Verifying with secret:", JWT_SECRET);

      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error in auth middleware:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.warn('Invalid token provided to optionalAuth');
    }
  }

  next(); // Always allow
};


export default authMiddleware;
