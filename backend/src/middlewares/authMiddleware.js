// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'justevents-secret';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
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

export default authMiddleware;
