// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'justevents-secret';

export const verifyToken = (req, res, next) => {
  try {
    // Check for the token in the headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
      }

      // Attach the decoded user info to the request object
      req.user = decoded;
      next();
    });
    
    //Return an error if the token is missing or invalid
  } catch (error) {
    console.error('Error in auth middleware:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};