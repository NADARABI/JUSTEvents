import SavedEvent from '../models/SavedEvent.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('SavedEvent model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save event for user', async () => {
      db.execute.mockResolvedValueOnce();
      const ok = await SavedEvent.save(1, 2);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO saved_events'),
        [1, 2]
      );
      expect(ok).toBe(true);
    });
    it('should return false if already saved (duplicate)', async () => {
      const err = new Error('Duplicate');
      err.code = 'ER_DUP_ENTRY';
      db.execute.mockRejectedValueOnce(err);
      const ok = await SavedEvent.save(1, 2);
      expect(ok).toBe(false);
    });
    it('should throw on other errors', async () => {
      const err = new Error('fail');
      db.execute.mockRejectedValueOnce(err);
      await expect(SavedEvent.save(1, 2)).rejects.toThrow('fail');
    });
  });

  it('should get saved events by user', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, title: 'T' }]]);
    const rows = await SavedEvent.getSavedByUser(2);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('FROM saved_events s'), [2]);
    expect(rows).toEqual([{ id: 1, title: 'T' }]);
  });

  it('should remove saved event (success)', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const ok = await SavedEvent.remove(1, 2);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM saved_events'), [1, 2]);
    expect(ok).toBe(1);
  });
  it('should not remove saved event (fail)', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const ok = await SavedEvent.remove(1, 2);
    expect(ok).toBe(0);
  });
}); 