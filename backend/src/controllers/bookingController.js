// src/controllers/bookingController.js
import Booking from '../models/Booking.js';
import { sendResponse } from '../utils/sendResponse.js';
import db from '../utils/db.js';


/**
 * User creates a new booking request
 */
export const createBooking = async (req, res) => {
  const user_id = req.user.id;
  const { room_id, purpose, start_time, end_time } = req.body;

  if (!room_id || !purpose || !start_time || !end_time) {
    return sendResponse(res, 400, 'All fields are required');
  }

  try {
    const hasConflict = await Booking.findConflictingBooking(room_id, start_time, end_time);
    if (hasConflict) {
      return sendResponse(res, 409, 'The room is already booked for the selected time slot');
    }
    const isDuplicate = await Booking.checkDuplicateBooking(user_id, room_id, start_time, end_time);
    if (isDuplicate) {
        return sendResponse(res, 409, 'You have already submitted a similar booking request');
    }

    const bookingId = await Booking.create({ user_id, room_id, purpose, start_time, end_time });
    return sendResponse(res, 201, 'Booking request submitted successfully', { bookingId });
  } catch (err) {
    console.error('createBooking error:', err.message);
    return sendResponse(res, 500, 'Server error while submitting booking');
  }
};

/**
 * Fetch all bookings made by the current user
 */
export const getMyBookings = async (req, res) => {
  const user_id = req.user.id;

  try {
    const bookings = await Booking.getByUser(user_id);
    return sendResponse(res, 200, 'Your bookings retrieved successfully', bookings);
  } catch (err) {
    console.error('getMyBookings error:', err.message);
    return sendResponse(res, 500, 'Server error while fetching bookings');
  }
};

/**
 * Cancel a user's booking if it is still pending
 */
export const cancelBooking = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  try {
    const result = await Booking.deleteById(id, user_id);

    if (result === 'not_found') {
      return sendResponse(res, 404, 'Booking not found');
    }

    if (result === 'not_owned') {
      return sendResponse(res, 403, 'You can only cancel your own bookings');
    }
    if (result === 'already_processed') {
      return sendResponse(res, 409, 'Booking already processed and cannot be cancelled');
    }
    if (result === 'deleted') {
      return sendResponse(res, 200, 'Booking cancelled successfully');
    }

    return sendResponse(res, 500, 'Failed to cancel booking');
  } catch (err) {
    console.error('cancelBooking error:', err.message);
    return sendResponse(res, 500, 'Unexpected server error');
  }
};


/**
 * Admin: Get all pending room booking requests
 */
export const getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.getPending();
    return sendResponse(res, 200, 'Pending booking requests retrieved successfully', bookings);
  } catch (err) {
    console.error('getPendingBookings error:', err.message);
    return sendResponse(res, 500, 'Server error while fetching pending bookings');
  }
};

/**
 * Admin: Approve or reject a booking request
 */
export const reviewBooking = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return sendResponse(res, 400, 'Invalid status. Must be either Approved or Rejected.');
  }

  try {
    const [rows] = await db.execute(`SELECT status FROM room_bookings WHERE id = ?`, [id]);

    if (rows.length === 0){
     return sendResponse(res, 404, 'Booking not found');
    }
    
    const currentStatus = rows[0].status;
    if (currentStatus !== 'Pending') {
      return sendResponse(res, 409, 'This booking has already been reviewed');
    }
    const updated = await Booking.updateStatus(id, status);
    if (!updated) {
      return sendResponse(res, 500, 'Failed to update booking status');
    }

    const booking = await db.execute(`SELECT user_id, room_id FROM room_bookings WHERE id = ?`, [id]);
    // Trigger Notification.create(user_id, `Your booking was ${status.toLowerCase()}`)
    
    return sendResponse(res, 200, `Booking ${status.toLowerCase()} successfully`);
  } catch (err) {
    console.error('reviewBooking error:', err.message);
    return sendResponse(res, 500, 'Server error while updating booking status');
  }
};
