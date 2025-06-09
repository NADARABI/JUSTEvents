import * as adminController from '../controllers/adminController.js';
import User from '../models/User.js';
import { sendResponse } from '../utils/sendResponse.js';

jest.mock('../models/User.js');
jest.mock('../utils/sendResponse.js');

describe('adminController', () => {
  let req, res;
  beforeEach(() => {
    req = { params: { id: '1' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getPendingUsers', () => {
    it('should fetch pending users successfully', async () => {
      User.getPendingUsers.mockResolvedValue([{ id: 1 }]);
      await adminController.getPendingUsers(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Pending users fetched successfully', [{ id: 1 }]);
    });
    it('should handle errors', async () => {
      User.getPendingUsers.mockRejectedValue(new Error('fail'));
      await adminController.getPendingUsers(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to fetch pending users');
    });
  });

  describe('approveUser', () => {
    it('should approve user successfully', async () => {
      User.findById.mockResolvedValue({ id: 1, role: 'Pending', requested_role: 'Organizer' });
      User.updateRole.mockResolvedValue();
      await adminController.approveUser(req, res);
      expect(User.updateRole).toHaveBeenCalledWith('1', 'Organizer');
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'User approved as Organizer');
    });
    it('should return 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);
      await adminController.approveUser(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'User not found');
    });
    it('should return 400 if user is not pending', async () => {
      User.findById.mockResolvedValue({ id: 1, role: 'Visitor', requested_role: 'Organizer' });
      await adminController.approveUser(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'User is not pending approval');
    });
    it('should return 400 if user has no requested role', async () => {
      User.findById.mockResolvedValue({ id: 1, role: 'Pending', requested_role: null });
      await adminController.approveUser(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'User has no requested role');
    });
    it('should handle errors', async () => {
      User.findById.mockRejectedValue(new Error('fail'));
      await adminController.approveUser(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to approve user');
    });
  });

  describe('rejectUser', () => {
    it('should reject user successfully', async () => {
      User.findById.mockResolvedValue({ id: 1, role: 'Pending' });
      User.updateRole.mockResolvedValue();
      await adminController.rejectUser(req, res);
      expect(User.updateRole).toHaveBeenCalledWith('1', 'Visitor');
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'User rejected and set as Visitor');
    });
    it('should return 404 if user not found', async () => {
      User.findById.mockResolvedValue(null);
      await adminController.rejectUser(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'User not found');
    });
    it('should return 400 if user is not pending', async () => {
      User.findById.mockResolvedValue({ id: 1, role: 'Visitor' });
      await adminController.rejectUser(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'User is not pending approval');
    });
    it('should handle errors', async () => {
      User.findById.mockRejectedValue(new Error('fail'));
      await adminController.rejectUser(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to reject user');
    });
  });
}); 