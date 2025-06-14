import Booking from '../models/Booking.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('Booking model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new booking', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 42 }]);
    const id = await Booking.create({ user_id: 1, room_id: 2, purpose: 'test', start_time: 's', end_time: 'e' });
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO room_bookings'), [1, 2, 'test', 's', 'e']);
    expect(id).toBe(42);
  });

  it('should get bookings by user', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, room_name: 'A', building: 'B' }]]);
    const rows = await Booking.getByUser(1);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('FROM room_bookings b'), [1]);
    expect(rows).toEqual([{ id: 1, room_name: 'A', building: 'B' }]);
  });

  it('should find conflicting booking', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1 }]]);
    const found = await Booking.findConflictingBooking(2, 's', 'e');
    expect(db.execute).toHaveBeenCalled();
    expect(found).toBe(true);
  });

  it('should not find conflicting booking', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const found = await Booking.findConflictingBooking(2, 's', 'e');
    expect(found).toBe(false);
  });

  it('should get pending bookings', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, status: 'Pending' }]]);
    const rows = await Booking.getPending();
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE b.status = \'Pending\''));
    expect(rows).toEqual([{ id: 1, status: 'Pending' }]);
  });

  it('should update booking status', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const ok = await Booking.updateStatus(5, 'Approved');
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('UPDATE room_bookings'), ['Approved', 5]);
    expect(ok).toBe(true);
  });

  it('should not update booking status if no rows affected', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const ok = await Booking.updateStatus(5, 'Rejected');
    expect(ok).toBe(false);
  });

  describe('deleteById', () => {
    it('should return not_found if booking does not exist', async () => {
      db.execute.mockResolvedValueOnce([[]]);
      const res = await Booking.deleteById(1, 2);
      expect(res).toBe('not_found');
    });
    it('should return not_owned if user does not own booking', async () => {
      db.execute.mockResolvedValueOnce([[{ id: 1, user_id: 3, status: 'Pending' }]]);
      const res = await Booking.deleteById(1, 2);
      expect(res).toBe('not_owned');
    });
    it('should return already_processed if booking is not pending', async () => {
      db.execute.mockResolvedValueOnce([[{ id: 1, user_id: 2, status: 'Approved' }]]);
      const res = await Booking.deleteById(1, 2);
      expect(res).toBe('already_processed');
    });
    it('should delete and return deleted if all checks pass', async () => {
      db.execute
        .mockResolvedValueOnce([[{ id: 1, user_id: 2, status: 'Pending' }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);
      const res = await Booking.deleteById(1, 2);
      expect(res).toBe('deleted');
    });
    it('should return error if delete fails', async () => {
      db.execute
        .mockResolvedValueOnce([[{ id: 1, user_id: 2, status: 'Pending' }]])
        .mockResolvedValueOnce([{ affectedRows: 0 }]);
      const res = await Booking.deleteById(1, 2);
      expect(res).toBe('error');
    });
  });

  it('should check duplicate booking', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1 }]]);
    const found = await Booking.checkDuplicateBooking(1, 2, 's', 'e');
    expect(found).toBe(true);
  });
  it('should not find duplicate booking', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const found = await Booking.checkDuplicateBooking(1, 2, 's', 'e');
    expect(found).toBe(false);
  });

  it('should get booking stats', async () => {
    db.execute
      .mockResolvedValueOnce([[{ total_pending: 2 }]])
      .mockResolvedValueOnce([[{ total_today: 1 }]])
      .mockResolvedValueOnce([[{ total_approved: 3 }]])
      .mockResolvedValueOnce([[{ total_rejected: 4 }]]);
    const stats = await Booking.getBookingStats();
    expect(stats).toEqual({
      total_pending: 2,
      total_today: 1,
      total_approved: 3,
      total_rejected: 4
    });
  });

  it('should get booking by id', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 7, room_name: 'A', building: 'B', user_name: 'U', user_email: 'E' }]]);
    const row = await Booking.getById(7);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE b.id = ?'), [7]);
    expect(row).toEqual({ id: 7, room_name: 'A', building: 'B', user_name: 'U', user_email: 'E' });
  });
  it('should return null if booking by id not found', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const row = await Booking.getById(7);
    expect(row).toBeNull();
  });
}); 