import * as bookingController from '../controllers/bookingController.js';
import Booking from '../models/Booking.js';
import db from '../utils/db.js';
import { createNotification } from '../utils/notificationHelper.js';
import { sendResponse } from '../utils/sendResponse.js';

jest.mock('../models/Booking.js');
jest.mock('../utils/db.js');
jest.mock('../utils/notificationHelper.js');
jest.mock('../utils/sendResponse.js');

describe('bookingController', () => {
  let req, res;
  beforeEach(() => {
    req = { user: { id: 1, name: 'Test User' }, body: {}, params: {} };
    res = {};
    jest.clearAllMocks();
    Booking.findConflictingBooking = jest.fn();
    Booking.checkDuplicateBooking = jest.fn();
    Booking.create = jest.fn();
    Booking.getByUser = jest.fn();
    Booking.deleteById = jest.fn();
    Booking.getPending = jest.fn();
    Booking.updateStatus = jest.fn();
    Booking.getBookingStats = jest.fn();
    Booking.getById = jest.fn();
    db.execute = jest.fn();
    createNotification.mockResolvedValue();
  });

  // createBooking
  it('createBooking: missing fields', async () => {
    req.body = { room_id: 1, purpose: '', start_time: '', end_time: '' };
    await bookingController.createBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'All fields are required');
  });
  it('createBooking: conflict', async () => {
    req.body = { room_id: 1, purpose: 'Study', start_time: '2024-01-01', end_time: '2024-01-02' };
    Booking.findConflictingBooking.mockResolvedValue(true);
    await bookingController.createBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 409, expect.stringContaining('already booked'));
  });
  it('createBooking: duplicate', async () => {
    req.body = { room_id: 1, purpose: 'Study', start_time: '2024-01-01', end_time: '2024-01-02' };
    Booking.findConflictingBooking.mockResolvedValue(false);
    Booking.checkDuplicateBooking.mockResolvedValue(true);
    await bookingController.createBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 409, expect.stringContaining('already submitted'));
  });
  it('createBooking: success', async () => {
    req.body = { room_id: 1, purpose: 'Study', start_time: '2024-01-01', end_time: '2024-01-02' };
    Booking.findConflictingBooking.mockResolvedValue(false);
    Booking.checkDuplicateBooking.mockResolvedValue(false);
    Booking.create.mockResolvedValue(123);
    db.execute
      .mockResolvedValueOnce([[{ id: 2, name: 'Admin' }]])
      .mockResolvedValueOnce([[{ name: 'Room 1' }]]);
    createNotification.mockResolvedValue();
    await bookingController.createBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 201, expect.stringContaining('submitted successfully'), { bookingId: 123 });
  });
  it('createBooking: error', async () => {
    req.body = { room_id: 1, purpose: 'Study', start_time: '2024-01-01', end_time: '2024-01-02' };
    Booking.findConflictingBooking.mockRejectedValue(new Error('fail'));
    await bookingController.createBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error'));
  });

  // getMyBookings
  it('getMyBookings: success', async () => {
    Booking.getByUser.mockResolvedValue([{ id: 1 }]);
    await bookingController.getMyBookings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('retrieved successfully'), [{ id: 1 }]);
  });
  it('getMyBookings: error', async () => {
    Booking.getByUser.mockRejectedValue(new Error('fail'));
    await bookingController.getMyBookings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error'));
  });

  // cancelBooking
  it('cancelBooking: not found', async () => {
    req.params.id = 1;
    Booking.deleteById.mockResolvedValue('not_found');
    await bookingController.cancelBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, expect.stringContaining('not found'));
  });
  it('cancelBooking: not owned', async () => {
    req.params.id = 1;
    Booking.deleteById.mockResolvedValue('not_owned');
    await bookingController.cancelBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 403, expect.stringContaining('only cancel your own'));
  });
  it('cancelBooking: already processed', async () => {
    req.params.id = 1;
    Booking.deleteById.mockResolvedValue('already_processed');
    await bookingController.cancelBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 409, expect.stringContaining('already processed'));
  });
  it('cancelBooking: deleted', async () => {
    req.params.id = 1;
    Booking.deleteById.mockResolvedValue('deleted');
    await bookingController.cancelBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('cancelled successfully'));
  });
  it('cancelBooking: fail', async () => {
    req.params.id = 1;
    Booking.deleteById.mockResolvedValue('other');
    await bookingController.cancelBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to cancel booking'));
  });
  it('cancelBooking: error', async () => {
    req.params.id = 1;
    Booking.deleteById.mockRejectedValue(new Error('fail'));
    await bookingController.cancelBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Unexpected server error'));
  });

  // getPendingBookings
  it('getPendingBookings: success', async () => {
    Booking.getPending.mockResolvedValue([{ id: 1 }]);
    await bookingController.getPendingBookings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('retrieved successfully'), [{ id: 1 }]);
  });
  it('getPendingBookings: error', async () => {
    Booking.getPending.mockRejectedValue(new Error('fail'));
    await bookingController.getPendingBookings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to fetch pending booking requests'));
  });

  // reviewBooking
  it('reviewBooking: invalid status', async () => {
    req.params.id = 1;
    req.body.status = 'Invalid';
    await bookingController.reviewBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, expect.stringContaining('Invalid status'));
  });
  it('reviewBooking: not found', async () => {
    req.params.id = 1;
    req.body.status = 'Approved';
    db.execute.mockResolvedValue([[]]);
    await bookingController.reviewBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, expect.stringContaining('Booking not found'));
  });
  it('reviewBooking: already reviewed', async () => {
    req.params.id = 1;
    req.body.status = 'Approved';
    db.execute.mockResolvedValue([[{ user_id: 2, room_id: 3, status: 'Approved' }]]);
    await bookingController.reviewBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 409, expect.stringContaining('already been reviewed'));
  });
  it('reviewBooking: update fail', async () => {
    req.params.id = 1;
    req.body.status = 'Approved';
    db.execute.mockResolvedValue([[{ user_id: 2, room_id: 3, status: 'Pending' }]]);
    Booking.updateStatus.mockResolvedValue(false);
    await bookingController.reviewBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to update booking status'));
  });
  it('reviewBooking: success', async () => {
    req.params.id = 1;
    req.body.status = 'Approved';
    db.execute.mockResolvedValue([[{ user_id: 2, room_id: 3, status: 'Pending' }]]);
    Booking.updateStatus.mockResolvedValue(true);
    createNotification.mockResolvedValue();
    await bookingController.reviewBooking(req, res);
    expect(createNotification).toHaveBeenCalledWith(2, expect.stringContaining('approved'), 'success');
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('approved successfully'));
  });
  it('reviewBooking: error', async () => {
    req.params.id = 1;
    req.body.status = 'Approved';
    db.execute.mockRejectedValue(new Error('fail'));
    await bookingController.reviewBooking(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to process booking decision'));
  });

  // getBookingStats
  it('getBookingStats: success', async () => {
    Booking.getBookingStats.mockResolvedValue({ total: 5 });
    await bookingController.getBookingStats(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Booking summary stats retrieved'), { total: 5 });
  });
  it('getBookingStats: error', async () => {
    Booking.getBookingStats.mockRejectedValue(new Error('fail'));
    await bookingController.getBookingStats(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to fetch booking summary stats'));
  });

  // getBookingById
  it('getBookingById: not found', async () => {
    req.params.id = 1;
    Booking.getById.mockResolvedValue(null);
    await bookingController.getBookingById(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, expect.stringContaining('Booking not found'));
  });
  it('getBookingById: success', async () => {
    req.params.id = 1;
    Booking.getById.mockResolvedValue({ id: 1 });
    await bookingController.getBookingById(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Booking retrieved'), { id: 1 });
  });
  it('getBookingById: error', async () => {
    req.params.id = 1;
    Booking.getById.mockRejectedValue(new Error('fail'));
    await bookingController.getBookingById(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to fetch booking'));
  });
}); 