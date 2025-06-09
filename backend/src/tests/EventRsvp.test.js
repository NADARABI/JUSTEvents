import EventRsvp from '../models/EventRsvp.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('EventRsvp model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should insert new RSVP if not exists', async () => {
      db.execute.mockResolvedValueOnce([[]]);
      db.execute.mockResolvedValueOnce();
      const res = await EventRsvp.add(1, 2);
      expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('SELECT id, status'), [1, 2]);
      expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO event_rsvps'), [1, 2]);
      expect(res).toBe(true);
    });
    it('should return false if already Going', async () => {
      db.execute.mockResolvedValueOnce([[{ id: 1, status: 'Going' }]]);
      const res = await EventRsvp.add(1, 2);
      expect(res).toBe(false);
    });
    it('should update to Going if previously Not Going', async () => {
      db.execute.mockResolvedValueOnce([[{ id: 1, status: 'Not Going' }]]);
      db.execute.mockResolvedValueOnce();
      const res = await EventRsvp.add(1, 2);
      expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('UPDATE event_rsvps SET status = \'Going\''), [1, 2]);
      expect(res).toBe(true);
    });
  });

  describe('remove', () => {
    it('should return false if RSVP does not exist', async () => {
      db.execute.mockResolvedValueOnce([[]]);
      const res = await EventRsvp.remove(1, 2);
      expect(res).toBe(false);
    });
    it('should update to Not Going if RSVP exists', async () => {
      db.execute.mockResolvedValueOnce([[{ id: 1 }]]);
      db.execute.mockResolvedValueOnce();
      const res = await EventRsvp.remove(1, 2);
      expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('UPDATE event_rsvps SET status = \'Not Going\''), [1, 2]);
      expect(res).toBe(true);
    });
  });

  it('should get RSVPs by event', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, name: 'A', email: 'a@b.com', status: 'Going' }]]);
    const rows = await EventRsvp.getByEvent(2);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('JOIN users'), [2]);
    expect(rows).toEqual([{ id: 1, name: 'A', email: 'a@b.com', status: 'Going' }]);
  });

  it('should get stats', async () => {
    db.execute
      .mockResolvedValueOnce([[{ total: 5 }]])
      .mockResolvedValueOnce([[{ going: 3 }]]);
    const stats = await EventRsvp.getStats(2);
    expect(stats).toEqual({ total: 5, going: 3 });
  });
  it('should get stats with no data', async () => {
    db.execute
      .mockResolvedValueOnce([[{}]])
      .mockResolvedValueOnce([[{}]]);
    const stats = await EventRsvp.getStats(2);
    expect(stats).toEqual({ total: 0, going: 0 });
  });
}); 