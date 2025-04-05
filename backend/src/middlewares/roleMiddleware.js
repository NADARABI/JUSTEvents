// src/middlewares/roleMiddleware.js
export const authorizeRole = (requiredRoles) => {
    return (req, res, next) => {
      try {
        // Check if the user's role is in the list of allowed roles
        if (!requiredRoles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
      } catch (error) {
        console.error('Error in role middleware:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
      }
    };
  };
  