import { authorizeRole } from '../middlewares/roleMiddleware.js';

describe('authorizeRole middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { role: 'Admin' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next if user has required role', () => {
    const middleware = authorizeRole(['Admin', 'User']);
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have required role', () => {
    req.user.role = 'Guest';
    const middleware = authorizeRole(['Admin', 'User']);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Insufficient permissions' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle missing req.user gracefully', () => {
    req = {}; // no user
    const middleware = authorizeRole(['Admin']);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors', () => {
    // Force error by making requiredRoles not iterable
    const middleware = authorizeRole(null);
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    expect(next).not.toHaveBeenCalled();
  });
}); 