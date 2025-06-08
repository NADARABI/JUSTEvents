import * as analytics from '../controllers/analyticsController.js';
import db from '../utils/db.js';
import Event from '../models/Event.js';
import { sendResponse } from '../utils/sendResponse.js';

jest.mock('../utils/db.js');
jest.mock('../models/Event.js');
jest.mock('../utils/sendResponse.js');

describe('analyticsController', () => {
  let req, res;
  beforeEach(() => {
    req = { params: {}, query: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
    Event.getEventsByDateRange = jest.fn();
    Event.getExpiryStats = jest.fn();
    Event.autoCloseExpiredEvents = jest.fn();
  });

  // getTotalEvents
  it('getTotalEvents: success', async () => {
    db.execute.mockResolvedValue([[{ count: 5 }]]);
    await analytics.getTotalEvents(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), { count: 5 });
  });
  it('getTotalEvents: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getTotalEvents(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getTotalRSVPs
  it('getTotalRSVPs: success', async () => {
    db.execute.mockResolvedValue([[{ count: 10 }]]);
    await analytics.getTotalRSVPs(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), { count: 10 });
  });
  it('getTotalRSVPs: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getTotalRSVPs(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getRSVPsForEvent
  it('getRSVPsForEvent: success', async () => {
    req.params.id = 1;
    db.execute.mockResolvedValue([[{ count: 3 }]]);
    await analytics.getRSVPsForEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), { count: 3 });
  });
  it('getRSVPsForEvent: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getRSVPsForEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getTopEvents
  it('getTopEvents: success', async () => {
    db.execute.mockResolvedValue([[{ id: 1, title: 'A', rsvp_count: 5 }]]);
    await analytics.getTopEvents(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), [{ id: 1, title: 'A', rsvp_count: 5 }]);
  });
  it('getTopEvents: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getTopEvents(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getRsvpTrend
  it('getRsvpTrend: success', async () => {
    db.execute.mockResolvedValue([[{ date: '2024-01-01', count: 2 }]]);
    await analytics.getRsvpTrend(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), [{ date: '2024-01-01', count: 2 }]);
  });
  it('getRsvpTrend: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getRsvpTrend(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getCategoryStats
  it('getCategoryStats: success', async () => {
    db.execute.mockResolvedValue([[{ category: 'Tech', total_events: 2, total_rsvps: 5, avg_rating: 4.5 }]]);
    await analytics.getCategoryStats(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), [{ category: 'Tech', total_events: 2, total_rsvps: 5, avg_rating: 4.5 }]);
  });
  it('getCategoryStats: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getCategoryStats(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getExpiryStats
  it('getExpiryStats: success', async () => {
    Event.getExpiryStats.mockResolvedValue({ expired: 2, active: 3 });
    await analytics.getExpiryStats(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), { expired: 2, active: 3 });
  });
  it('getExpiryStats: fail', async () => {
    Event.getExpiryStats.mockRejectedValue(new Error('fail'));
    await analytics.getExpiryStats(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getTopEngagedUsers
  it('getTopEngagedUsers: success', async () => {
    db.execute.mockResolvedValue([[{ id: 1, name: 'User', engagement_score: 10 }]]);
    await analytics.getTopEngagedUsers(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), [{ id: 1, name: 'User', engagement_score: 10 }]);
  });
  it('getTopEngagedUsers: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getTopEngagedUsers(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getEventOfTheWeek
  it('getEventOfTheWeek: success', async () => {
    db.execute.mockResolvedValue([[{ id: 1, title: 'Event', rsvp_count: 5, avg_rating: 4.5 }]]);
    await analytics.getEventOfTheWeek(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), { id: 1, title: 'Event', rsvp_count: 5, avg_rating: 4.5 });
  });
  it('getEventOfTheWeek: empty', async () => {
    db.execute.mockResolvedValue([[]]);
    await analytics.getEventOfTheWeek(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), null);
  });
  it('getEventOfTheWeek: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getEventOfTheWeek(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // autoCloseExpired
  it('autoCloseExpired: success', async () => {
    Event.autoCloseExpiredEvents.mockResolvedValue(2);
    await analytics.autoCloseExpired(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('events marked as expired'), { affected: 2 });
  });
  it('autoCloseExpired: fail', async () => {
    Event.autoCloseExpiredEvents.mockRejectedValue(new Error('fail'));
    await analytics.autoCloseExpired(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getEventsInRange
  it('getEventsInRange: success (week)', async () => {
    req.query.range = 'week';
    Event.getEventsByDateRange.mockResolvedValue([{ id: 1 }]);
    await analytics.getEventsInRange(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), [{ id: 1 }]);
  });
  it('getEventsInRange: success (month)', async () => {
    req.query.range = 'month';
    Event.getEventsByDateRange.mockResolvedValue([{ id: 2 }]);
    await analytics.getEventsInRange(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), [{ id: 2 }]);
  });
  it('getEventsInRange: fail', async () => {
    Event.getEventsByDateRange.mockRejectedValue(new Error('fail'));
    await analytics.getEventsInRange(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getTotalBookings
  it('getTotalBookings: success', async () => {
    db.execute.mockResolvedValue([[{ count: 7 }]]);
    await analytics.getTotalBookings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), { count: 7 });
  });
  it('getTotalBookings: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getTotalBookings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getMostUsedRooms
  it('getMostUsedRooms: success', async () => {
    db.execute.mockResolvedValue([[{ id: 1, room_name: 'A', bookings: 3 }]]);
    await analytics.getMostUsedRooms(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), [{ id: 1, room_name: 'A', bookings: 3 }]);
  });
  it('getMostUsedRooms: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getMostUsedRooms(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getBookingTrends
  it('getBookingTrends: success', async () => {
    db.execute.mockResolvedValue([[{ date: '2024-01-01', count: 2 }]]);
    await analytics.getBookingTrends(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), [{ date: '2024-01-01', count: 2 }]);
  });
  it('getBookingTrends: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getBookingTrends(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getBookingsByBuilding
  it('getBookingsByBuilding: success', async () => {
    db.execute.mockResolvedValue([[{ building: 'A', bookings: 4 }]]);
    await analytics.getBookingsByBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), [{ building: 'A', bookings: 4 }]);
  });
  it('getBookingsByBuilding: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getBookingsByBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getBookingCancelRate
  it('getBookingCancelRate: success', async () => {
    db.execute
      .mockResolvedValueOnce([[{ total: 10 }]])
      .mockResolvedValueOnce([[{ cancelled: 2 }]]);
    await analytics.getBookingCancelRate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), { cancelled: 2, total: 10, cancel_rate: expect.any(String) });
  });
  it('getBookingCancelRate: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await analytics.getBookingCancelRate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // getPopularEventsPublic
  it('getPopularEventsPublic: success', async () => {
    db.query.mockResolvedValue([[{ id: 1, title: 'A', rsvp_count: 5 }]]);
    await analytics.getPopularEventsPublic(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, title: 'A', rsvp_count: 5 }]);
  });
  it('getPopularEventsPublic: fail', async () => {
    db.query.mockRejectedValue(new Error('fail'));
    await analytics.getPopularEventsPublic(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  // getSummaryPublic
  it('getSummaryPublic: success', async () => {
    db.query
      .mockResolvedValueOnce([[{ totalEvents: 2 }]])
      .mockResolvedValueOnce([[{ totalUsers: 3 }]])
      .mockResolvedValueOnce([[{ totalFeedback: 4 }]]);
    await analytics.getSummaryPublic(req, res);
    expect(res.json).toHaveBeenCalledWith({ totalEvents: 2, totalUsers: 3, totalFeedback: 4 });
  });
  it('getSummaryPublic: fail', async () => {
    db.query.mockRejectedValue(new Error('fail'));
    await analytics.getSummaryPublic(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
}); 