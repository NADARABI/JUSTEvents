import * as notificationController from '../controllers/notificationController.js';
import Notification from '../models/Notification.js';
import { sendResponse } from '../utils/sendResponse.js';

jest.mock('../models/Notification.js');
jest.mock('../utils/sendResponse.js');

describe('notificationController', () => {
  let req, res;
  beforeEach(() => {
    req = { user: { id: 1, role: 'User' }, params: { id: '5' }, query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getUserNotifications', () => {
    it('should fetch all notifications for user', async () => {
      Notification.getByUser.mockResolvedValue([{ id: 1 }]);
      await notificationController.getUserNotifications(req, res);
      expect(Notification.getByUser).toHaveBeenCalledWith(1, false);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Notifications fetched successfully', [{ id: 1 }]);
    });
    it('should fetch only unread notifications if query.unread is true', async () => {
      req.query.unread = 'true';
      Notification.getByUser.mockResolvedValue([{ id: 2 }]);
      await notificationController.getUserNotifications(req, res);
      expect(Notification.getByUser).toHaveBeenCalledWith(1, true);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Notifications fetched successfully', [{ id: 2 }]);
    });
    it('should handle errors', async () => {
      Notification.getByUser.mockRejectedValue(new Error('fail'));
      await notificationController.getUserNotifications(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to fetch notifications');
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark notification as read', async () => {
      Notification.markAsRead.mockResolvedValue(1);
      await notificationController.markNotificationAsRead(req, res);
      expect(Notification.markAsRead).toHaveBeenCalledWith('5', 1);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Notification marked as read');
    });
    it('should return 404 if notification not found or already read', async () => {
      Notification.markAsRead.mockResolvedValue(0);
      await notificationController.markNotificationAsRead(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Notification not found or already read');
    });
    it('should handle errors', async () => {
      Notification.markAsRead.mockRejectedValue(new Error('fail'));
      await notificationController.markNotificationAsRead(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to mark notification as read');
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read and return count', async () => {
      Notification.markAllAsRead.mockResolvedValue(3);
      await notificationController.markAllNotificationsAsRead(req, res);
      expect(Notification.markAllAsRead).toHaveBeenCalledWith(1);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, '3 notifications marked as read');
    });
    it('should return message if no unread notifications found', async () => {
      Notification.markAllAsRead.mockResolvedValue(0);
      await notificationController.markAllNotificationsAsRead(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'No unread notifications found');
    });
    it('should handle errors', async () => {
      Notification.markAllAsRead.mockRejectedValue(new Error('fail'));
      await notificationController.markAllNotificationsAsRead(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to mark all notifications as read');
    });
  });

  describe('deleteOldNotifications', () => {
    it('should delete old notifications if user is System Admin', async () => {
      req.user.role = 'System Admin';
      Notification.deleteOld.mockResolvedValue(7);
      await notificationController.deleteOldNotifications(req, res);
      expect(Notification.deleteOld).toHaveBeenCalledWith(30);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, '7 old notifications deleted');
    });
    it('should deny access if user is not System Admin', async () => {
      req.user.role = 'User';
      await notificationController.deleteOldNotifications(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 403, 'Access denied: Admins only');
    });
    it('should handle errors', async () => {
      req.user.role = 'System Admin';
      Notification.deleteOld.mockRejectedValue(new Error('fail'));
      await notificationController.deleteOldNotifications(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to delete old notifications');
    });
  });
}); 