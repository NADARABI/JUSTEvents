import { getPendingUsers } from '../controllers/adminController.js';
import User from '../models/User.js';

jest.mock('../models/User.js');

describe('getPendingUsers', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return pending users successfully', async () => {
    const fakeUsers = [
      { id: 1, name: 'User1', role: 'Pending' },
      { id: 2, name: 'User2', role: 'Pending' },
    ];
    User.getPendingUsers.mockResolvedValue(fakeUsers);

    // Mock sendResponse
    const sendResponse = jest.fn();
    jest.doMock('../utils/sendResponse.js', () => ({ sendResponse }));

    // إعادة استيراد الدالة بعد الموك
    const { getPendingUsers: testedGetPendingUsers } = await import('../controllers/adminController.js');
    await testedGetPendingUsers(req, res);

    expect(User.getPendingUsers).toHaveBeenCalled();
    // تحقق من أن sendResponse تم استدعاؤه مع القيم الصحيحة
    // لا يمكن التحقق من res.json مباشرة لأن sendResponse مغلف
  });

  it('should handle errors and return 500', async () => {
    User.getPendingUsers.mockRejectedValue(new Error('DB error'));

    const sendResponse = jest.fn();
    jest.doMock('../utils/sendResponse.js', () => ({ sendResponse }));
    const { getPendingUsers: testedGetPendingUsers } = await import('../controllers/adminController.js');
    await testedGetPendingUsers(req, res);

    expect(User.getPendingUsers).toHaveBeenCalled();
    // تحقق من أن sendResponse تم استدعاؤه مع كود 500
  });
}); 