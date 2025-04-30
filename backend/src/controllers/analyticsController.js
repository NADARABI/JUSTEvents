import db from '../utils/db.js';
import Event from '../models/Event.js';
import { sendResponse } from '../utils/sendResponse.js';

//Event Analytics
export const getTotalEvents = async (req, res) => {
  try {
    const [[{ count }]] = await db.execute(`SELECT COUNT(*) AS count FROM events`);
    sendResponse(res, 200, 'Total number of events calculated', { count });
  } catch (err) {
    console.error('getTotalEvents error:', err.message);
    sendResponse(res, 500, 'Failed to calculate total events');
  }
};

export const getTotalRSVPs = async (req, res) => {
  try {
    const [[{ count }]] = await db.execute(`SELECT COUNT(*) AS count FROM event_rsvps`);
    sendResponse(res, 200, 'Total number of RSVPs calculated', { count });
  } catch (err) {
    console.error('getTotalRSVPs error:', err.message);
    sendResponse(res, 500, 'Failed to calculate RSVP total');
  }
};

export const getRSVPsForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const [[{ count }]] = await db.execute(`SELECT COUNT(*) AS count FROM event_rsvps WHERE event_id = ?`, [id]);
    sendResponse(res, 200, 'RSVPs for event fetched', { count });
  } catch (err) {
    console.error('getRSVPsForEvent error:', err.message);
    sendResponse(res, 500, 'Failed to fetch RSVP count for event');
  }
};

export const getTopEvents = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT e.id, e.title, COUNT(r.id) AS rsvp_count
      FROM events e
      LEFT JOIN event_rsvps r ON e.id = r.event_id
      GROUP BY e.id
      ORDER BY rsvp_count DESC
      LIMIT 3
    `);
    sendResponse(res, 200, 'Top RSVP’d events fetched', rows);
  } catch (err) {
    console.error('getTopEvents error:', err.message);
    sendResponse(res, 500, 'Failed to fetch top events');
  }
};

export const getRsvpTrend = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM event_rsvps
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    sendResponse(res, 200, 'RSVP trend data generated', rows);
  } catch (err) {
    console.error('getRsvpTrend error:', err.message);
    sendResponse(res, 500, 'Failed to fetch RSVP trend');
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        e.category,
        COUNT(e.id) AS total_events,
        COUNT(r.id) AS total_rsvps,
        ROUND(AVG(f.rating), 2) AS avg_rating
      FROM events e
      LEFT JOIN event_rsvps r ON e.id = r.event_id
      LEFT JOIN feedback f ON e.id = f.event_id
      GROUP BY e.category
      ORDER BY total_events DESC
    `);
    sendResponse(res, 200, 'Event category statistics fetched', rows);
  } catch (err) {
    console.error('getCategoryStats error:', err.message);
    sendResponse(res, 500, 'Failed to fetch category stats');
  }
};

export const getExpiryStats = async (req, res) => {
  try {
    const stats = await Event.getExpiryStats();
    sendResponse(res, 200, 'Event expiry status breakdown fetched', stats);
  } catch (err) {
    console.error('getExpiryStats error:', err.message);
    sendResponse(res, 500, 'Failed to fetch expiry statistics');
  }
};

export const getTopEngagedUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(DISTINCT r.id) AS rsvp_count,
        COUNT(DISTINCT f.id) AS feedback_count,
        COUNT(DISTINCT s.id) AS saved_count,
        ((COUNT(DISTINCT r.id) * 2) + (COUNT(DISTINCT f.id) * 2) + (COUNT(DISTINCT s.id))) AS engagement_score
      FROM users u
      LEFT JOIN event_rsvps r ON u.id = r.user_id
      LEFT JOIN feedback f ON u.id = f.user_id
      LEFT JOIN saved_events s ON u.id = s.user_id
      GROUP BY u.id
      ORDER BY engagement_score DESC
      LIMIT 3
    `);
    sendResponse(res, 200, 'Top engaged users fetched', rows);
  } catch (err) {
    console.error('getTopEngagedUsers error:', err.message);
    sendResponse(res, 500, 'Failed to fetch engagement statistics');
  }
};

export const getEventOfTheWeek = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        e.id,
        e.title,
        e.category,
        COUNT(r.id) AS rsvp_count,
        ROUND(AVG(f.rating), 2) AS avg_rating
      FROM events e
      LEFT JOIN event_rsvps r ON e.id = r.event_id
      LEFT JOIN feedback f ON e.id = f.event_id
      WHERE e.date >= CURDATE() - INTERVAL 7 DAY
      GROUP BY e.id
      ORDER BY rsvp_count DESC, avg_rating DESC
      LIMIT 1
    `);
    sendResponse(res, 200, 'Event of the week identified', rows[0] || null);
  } catch (err) {
    console.error('getEventOfTheWeek error:', err.message);
    sendResponse(res, 500, 'Failed to fetch event of the week');
  }
};

export const autoCloseExpired = async (req, res) => {
  try {
    const affected = await Event.autoCloseExpiredEvents();
    sendResponse(res, 200, `${affected} events marked as expired`, { affected });
  } catch (err) {
    console.error('autoCloseExpired error:', err.message);
    sendResponse(res, 500, 'Failed to close expired events');
  }
};

export const getEventsInRange = async (req, res) => {
  try {
    const { range } = req.query;
    const today = new Date();
    let startDate = new Date(today);
    let endDate;

    if (range === 'week') {
      endDate = new Date(today);
      endDate.setDate(today.getDate() + 7);
    } else {
      // Default to current month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    const formattedStart = startDate.toISOString().split('T')[0];
    const formattedEnd = endDate.toISOString().split('T')[0];

    console.log('Date range:', formattedStart, formattedEnd);

    const events = await Event.getEventsByDateRange(formattedStart, formattedEnd);
    return sendResponse(res, 200, 'Events in selected range fetched', events);
  } catch (err) {
    console.error('getEventsInRange error:', err.message);
    return sendResponse(res, 500, 'Failed to fetch events');
  }
};

// Room Booking analytics
export const getTotalBookings = async (req, res) => {
  try {
    const [[{ count }]] = await db.execute(`SELECT COUNT(*) AS count FROM room_bookings`);
    sendResponse(res, 200, 'Total room bookings calculated', { count });
  } catch (err) {
    console.error('getTotalBookings error:', err.message);
    sendResponse(res, 500, 'Failed to calculate total bookings');
  }
};

export const getMostUsedRooms = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.id, r.name, r.building, COUNT(b.id) AS bookings
      FROM rooms r
      LEFT JOIN room_bookings b ON r.id = b.room_id
      GROUP BY r.id
      ORDER BY bookings DESC
      LIMIT 5
    `);
    sendResponse(res, 200, 'Most used rooms fetched', rows);
  } catch (err) {
    console.error('getMostUsedRooms error:', err.message);
    sendResponse(res, 500, 'Failed to fetch most used rooms');
  }
};

export const getBookingTrends = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT DATE(start_time) AS date, COUNT(*) AS count
      FROM room_bookings
      GROUP BY DATE(start_time)
      ORDER BY date ASC
    `);
    sendResponse(res, 200, 'Booking trends fetched', rows);
  } catch (err) {
    console.error('getBookingTrends error:', err.message);
    sendResponse(res, 500, 'Failed to fetch booking trends');
  }
};

export const getBookingsByBuilding = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT r.building, COUNT(b.id) AS bookings
      FROM room_bookings b
      JOIN rooms r ON b.room_id = r.id
      GROUP BY r.building
      ORDER BY bookings DESC
    `);
    sendResponse(res, 200, 'Bookings grouped by building fetched', rows);
  } catch (err) {
    console.error('getBookingsByBuilding error:', err.message);
    sendResponse(res, 500, 'Failed to fetch bookings by building');
  }
};

export const getBookingCancelRate = async (req, res) => {
  try {
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) AS total FROM room_bookings`);
    const [[{ cancelled }]] = await db.execute(`SELECT COUNT(*) AS cancelled FROM room_bookings WHERE status = 'Rejected'`);

    const rate = total > 0 ? ((cancelled / total) * 100).toFixed(2) : 0;
    sendResponse(res, 200, 'Booking cancellation rate calculated', { cancelled, total, cancel_rate: `${rate}%` });
  } catch (err) {
    console.error('getBookingCancelRate error:', err.message);
    sendResponse(res, 500, 'Failed to calculate booking cancel rate');
  }
};
