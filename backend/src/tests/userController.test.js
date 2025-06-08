import * as userController from '../controllers/userController.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('userController', () => {
  let req, res;
  beforeEach(() => {
    req = { params: { id: '1' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getUserBasicInfo', () => {
    it('should return user info if found', async () => {
      db.execute.mockResolvedValueOnce([[{ name: 'Test', role: 'User' }]]);
      await userController.getUserBasicInfo(req, res);
      expect(db.execute).toHaveBeenCalledWith('SELECT name, role FROM users WHERE id = ?', ['1']);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: { name: 'Test', role: 'User' } });
    });
    it('should return 404 if user not found', async () => {
      db.execute.mockResolvedValueOnce([[]]);
      await userController.getUserBasicInfo(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
    it('should handle db errors', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      await userController.getUserBasicInfo(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch user information' });
    });
  });
}); 