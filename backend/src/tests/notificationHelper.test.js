import { createNotification } from '../utils/notificationHelper.js';

// Mock Notification model
jest.mock('../models/Notification.js', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

import Notification from '../models/Notification.js';

describe('createNotification', () => {
  it('should call Notification.create with correct arguments', async () => {
    Notification.create.mockResolvedValueOnce();
    await createNotification(1, 'msg', 'custom');
    expect(Notification.create).toHaveBeenCalledWith(1, 'msg', 'custom');
  });

  it('should use default type if not provided', async () => {
    Notification.create.mockResolvedValueOnce();
    await createNotification(2, 'hello');
    expect(Notification.create).toHaveBeenCalledWith(2, 'hello', 'info');
  });

  it('should throw and log error if Notification.create fails', async () => {
    Notification.create.mockRejectedValueOnce(new Error('fail'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(createNotification(3, 'err')).rejects.toThrow('Failed to create notification');
    expect(errorSpy).toHaveBeenCalledWith('Notification.create error:', 'fail');
    errorSpy.mockRestore();
  });
}); 