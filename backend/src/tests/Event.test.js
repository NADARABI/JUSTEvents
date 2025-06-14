import Event from '../models/Event.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('Event model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should check conflict (no exclude)', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1 }]]);
    const found = await Event.checkConflict('2024-01-01', '10:00', 2);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('date = ? AND time = ? AND venue_id = ?'), ['2024-01-01', '10:00', 2]);
    expect(found).toBe(true);
  });
  it('should check conflict (with exclude)', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const found = await Event.checkConflict('2024-01-01', '10:00', 2, 5);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('AND id != ?'), ['2024-01-01', '10:00', 2, 5]);
    expect(found).toBe(false);
  });

  it('should create event', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 7 }]);
    const id = await Event.create({ title: 't', description: 'd', date: '2024-01-01', time: '10:00', organizer_id: 1, venue_id: 2 });
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO events'), expect.any(Array));
    expect(id).toBe(7);
  });

  it('should find event by id', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 3, title: 't' }]]);
    const row = await Event.findById(3);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE id = ?'), [3]);
    expect(row).toEqual({ id: 3, title: 't' });
  });

  it('should find all events (default)', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1 }]]);
    const rows = await Event.findAll();
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM events'), []);
    expect(rows).toEqual([{ id: 1 }]);
  });

  it('should find all events with filters', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 2 }]]);
    const rows = await Event.findAll({ status: 'Approved', search: 'abc', date: '2024-01-01', upcoming: true, category: 'C', sort: 'latest' });
    expect(db.execute).toHaveBeenCalled();
    expect(rows).toEqual([{ id: 2 }]);
  });

  it('should find all events with sort popular', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 3 }]]);
    const rows = await Event.findAll({ sort: 'popular' });
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('ORDER BY rsvp_count DESC'), expect.any(Array));
    expect(rows).toEqual([{ id: 3 }]);
  });

  it('should find all events with sort rating', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 4 }]]);
    const rows = await Event.findAll({ sort: 'rating' });
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('ORDER BY avg_rating DESC'), expect.any(Array));
    expect(rows).toEqual([{ id: 4 }]);
  });

  it('should find events by organizer', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 5 }]]);
    const rows = await Event.findByOrganizer(1);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('organizer_id = ?'), [1]);
    expect(rows).toEqual([{ id: 5 }]);
  });

  it('should update event fields', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await Event.update(1, { title: 'new' });
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('UPDATE events SET title = ? WHERE id = ?'), ['new', 1]);
    expect(affected).toBe(1);
  });
  it('should not update if no fields', async () => {
    const affected = await Event.update(1, {});
    expect(affected).toBe(0);
  });

  it('should delete event', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await Event.delete(1);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM events'), [1]);
    expect(affected).toBe(1);
  });

  it('should update event status', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await Event.updateStatus(1, 'Approved');
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('UPDATE events SET status = ?'), ['Approved', 1]);
    expect(affected).toBe(1);
  });

  it('should get expiry stats', async () => {
    db.query.mockResolvedValueOnce([[{ upcoming_events: 2, past_events: 3 }]]);
    const stats = await Event.getExpiryStats();
    expect(db.query).toHaveBeenCalled();
    expect(stats).toEqual({ upcoming_events: 2, past_events: 3 });
  });

  it('should auto close expired events', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 4 }]);
    const affected = await Event.autoCloseExpiredEvents();
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('SET status = \'Expired\''));
    expect(affected).toBe(4);
  });

  it('should get events by date range', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 8 }]]);
    const rows = await Event.getEventsByDateRange('2024-01-01', '2024-01-31');
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE date BETWEEN ? AND ?'), ['2024-01-01', '2024-01-31']);
    expect(rows).toEqual([{ id: 8 }]);
  });
}); 