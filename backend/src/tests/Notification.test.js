import Notification from '../models/Notification.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('Notification model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create notification', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 11 }]);
    const id = await Notification.create(1, 'msg', 'info');
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO notifications'),
      [1, 'msg', 'info']
    );
    expect(id).toBe(11);
  });

  it('should get notifications by user (all)', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, message: 'm' }]]);
    const rows = await Notification.getByUser(2);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('ORDER BY created_at DESC'), [2]);
    expect(rows).toEqual([{ id: 1, message: 'm' }]);
  });

  it('should get notifications by user (only unread)', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 2, is_read: 0 }]]);
    const rows = await Notification.getByUser(3, true);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('AND is_read = 0'), [3]);
    expect(rows).toEqual([{ id: 2, is_read: 0 }]);
  });

  it('should mark notification as read', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await Notification.markAsRead(5, 2);
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('SET is_read = 1'),
      [5, 2]
    );
    expect(affected).toBe(1);
  });

  it('should mark all as read', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 3 }]);
    const affected = await Notification.markAllAsRead(2);
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('SET is_read = 1 WHERE user_id = ? AND is_read = 0'),
      [2]
    );
    expect(affected).toBe(3);
  });

  it('should delete old notifications', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 4 }]);
    const affected = await Notification.deleteOld(10);
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM notifications WHERE created_at < NOW() - INTERVAL ? DAY'),
      [10]
    );
    expect(affected).toBe(4);
  });
}); 