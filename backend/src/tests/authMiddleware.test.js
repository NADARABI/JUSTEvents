import authMiddleware, { optionalAuth } from '../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no Authorization header', () => {
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if Authorization header does not start with Bearer', () => {
    req.headers.authorization = 'Token abc';
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    jwt.verify.mockImplementation((token, secret, cb) => cb(new Error('fail')));
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.user and call next if token is valid', () => {
    req.headers.authorization = 'Bearer validtoken';
    const decoded = { id: 1, name: 'test' };
    jwt.verify.mockImplementation((token, secret, cb) => cb(null, decoded));
    authMiddleware(req, res, next);
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });

  it('should handle unexpected errors and return 500', () => {
    // Force an error in try/catch
    const errorReq = null;
    authMiddleware(errorReq, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

describe('optionalAuth', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next and not set req.user if no Authorization header', () => {
    optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should call next and not set req.user if Authorization header is not Bearer', () => {
    req.headers.authorization = 'Token abc';
    optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('should set req.user if token is valid', () => {
    req.headers.authorization = 'Bearer validtoken';
    const decoded = { id: 2 };
    jwt.verify.mockReturnValue(decoded);
    optionalAuth(req, res, next);
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });

  it('should call next and not set req.user if token is invalid', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    jwt.verify.mockImplementation(() => { throw new Error('fail'); });
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
}); 