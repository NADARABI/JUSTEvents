import * as eventController from '../controllers/eventController.js';
import Event from '../models/Event.js';
import EventRsvp from '../models/EventRsvp.js';
import Approval from '../models/Approval.js';
import db from '../utils/db.js';
import { sendResponse } from '../utils/sendResponse.js';
import { createNotification } from '../utils/notificationHelper.js';

jest.mock('../models/Event.js', () => ({
  create: jest.fn().mockResolvedValue(123),
  checkConflict: jest.fn().mockResolvedValue(false),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));
jest.mock('../models/Approval.js', () => ({
  create: jest.fn().mockResolvedValue(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));
jest.mock('../models/EventRsvp.js');
jest.mock('../utils/db.js');
jest.mock('../utils/sendResponse.js');
jest.mock('../utils/notificationHelper.js');

jest.mock('../utils/db', () => ({
  execute: jest.fn(),
}));
jest.mock('../utils/notificationHelper.js', () => ({
  createNotification: jest.fn(),
  getSystemAdminIds: jest.fn(),
}));

describe('eventController', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, user: { id: 1 } };
    res = {};
    jest.clearAllMocks();
    Event.findById = jest.fn();
    Event.findAll = jest.fn();
    Event.create = jest.fn();
    Event.update = jest.fn();
    Event.delete = jest.fn();
    Event.deleteRSVPs = jest.fn();
    Event.checkConflict = jest.fn();
    EventRsvp.getByEvent = jest.fn();
    EventRsvp.add = jest.fn();
    EventRsvp.remove = jest.fn();
    EventRsvp.getStats = jest.fn();
    Approval.create = jest.fn();
    db.execute = jest.fn();
    createNotification.mockResolvedValue();
    require('../utils/db').execute.mockImplementation((query) => {
      if (query.includes('SELECT id FROM rooms')) return Promise.resolve([[{ id: 1 }]]);
      return Promise.resolve([[]]);
    });
    require('../utils/notificationHelper.js').createNotification.mockResolvedValue();
    require('../utils/notificationHelper.js').getSystemAdminIds.mockResolvedValue([1, 2]);
  });

  // createEvent
  it('createEvent: missing fields', async () => {
    req.body = { title: '', description: '', date: '', time: '', venue_id: '' };
    await eventController.createEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'All fields are required');
  });
  it('createEvent: invalid venue', async () => {
    req.body = { title: 't', description: 'd', date: '2024-01-01', time: '10:00', venue_id: 1 };
    db.execute.mockResolvedValue([[]]);
    await eventController.createEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Invalid venue ID');
  });
  it('createEvent: invalid date format', async () => {
    req.body = { title: 't', description: 'd', date: '01-01-2024', time: '10:00', venue_id: 1 };
    db.execute.mockResolvedValue([[{ id: 1 }]]);
    await eventController.createEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, expect.stringContaining('Invalid date format'));
  });
  it('createEvent: conflict', async () => {
    req.body = { title: 't', description: 'd', date: '2024-01-01', time: '10:00', venue_id: 1 };
    db.execute.mockResolvedValue([[{ id: 1 }]]);
    Event.checkConflict.mockResolvedValue(true);
    await eventController.createEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 409, expect.stringContaining('Venue already booked'));
  });
  it('createEvent: success', async () => {
    Event.create.mockResolvedValue(123);
    req.body = { title: 't', description: 'd', date: '2024-01-01', time: '10:00', venue_id: 1 };
    await eventController.createEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 201, expect.stringContaining('pending approval'), { eventId: 123 });
  });
  it('createEvent: error', async () => {
    req.body = { title: 't', description: 'd', date: '2024-01-01', time: '10:00', venue_id: 1 };
    db.execute.mockRejectedValue(new Error('fail'));
    await eventController.createEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while creating event'));
  });

  // editEvent
  it('editEvent: not found', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue(null);
    await eventController.editEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Event not found');
  });
  it('editEvent: unauthorized', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue({ organizer_id: 2 });
    await eventController.editEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 403, 'Unauthorized');
  });
  it('editEvent: conflict', async () => {
    req.params.id = 1;
    req.body = { date: '2024-01-01', time: '10:00', venue_id: 1 };
    Event.findById.mockResolvedValue({ organizer_id: 1, date: '2024-01-01', time: '10:00', venue_id: 1 });
    Event.checkConflict.mockResolvedValue(true);
    await eventController.editEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 409, expect.stringContaining('Venue already booked'));
  });
  it('editEvent: success', async () => {
    req.params.id = 1;
    req.body = { title: 'new' };
    Event.findById.mockResolvedValue({ organizer_id: 1, date: '2024-01-01', time: '10:00', venue_id: 1, title: 'old' });
    Event.checkConflict.mockResolvedValue(false);
    Event.update.mockResolvedValue();
    EventRsvp.getByEvent.mockResolvedValue([{ user_id: 2 }]);
    createNotification.mockResolvedValue();
    await eventController.editEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('updated successfully'));
  });
  it('editEvent: error', async () => {
    req.params.id = 1;
    Event.findById.mockRejectedValue(new Error('fail'));
    await eventController.editEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while editing event'));
  });

  // deleteEvent
  it('deleteEvent: not found', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue(null);
    await eventController.deleteEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Event not found');
  });
  it('deleteEvent: unauthorized', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue({ organizer_id: 2 });
    await eventController.deleteEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 403, 'Unauthorized');
  });
  it('deleteEvent: success', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue({ organizer_id: 1, title: 't' });
    EventRsvp.getByEvent.mockResolvedValue([{ user_id: 2 }]);
    Event.deleteRSVPs.mockResolvedValue();
    Event.delete.mockResolvedValue();
    createNotification.mockResolvedValue();
    await eventController.deleteEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('deleted successfully'));
  });
  it('deleteEvent: error', async () => {
    req.params.id = 1;
    Event.findById.mockRejectedValue(new Error('fail'));
    await eventController.deleteEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while deleting event'));
  });

  // getAllEvents
  it('getAllEvents: success', async () => {
    Event.findAll.mockResolvedValue([{ id: 1 }]);
    await eventController.getAllEvents(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Events fetched successfully'), [{ id: 1 }]);
  });
  it('getAllEvents: error', async () => {
    Event.findAll.mockRejectedValue(new Error('fail'));
    await eventController.getAllEvents(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to fetch events'));
  });

  // getEventById
  it('getEventById: not found', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue(null);
    await eventController.getEventById(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Event not found');
  });
  it('getEventById: success', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue({ id: 1 });
    await eventController.getEventById(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Event fetched successfully'), { id: 1 });
  });
  it('getEventById: error', async () => {
    req.params.id = 1;
    Event.findById.mockRejectedValue(new Error('fail'));
    await eventController.getEventById(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to fetch event'));
  });

  // rsvpEvent
  it('rsvpEvent: event not approved', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue({ status: 'Pending' });
    await eventController.rsvpEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 403, expect.stringContaining('cannot RSVP'));
  });
  it('rsvpEvent: already RSVPed', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue({ status: 'Approved' });
    EventRsvp.add.mockResolvedValue(false);
    await eventController.rsvpEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 409, expect.stringContaining('Already RSVPed'));
  });
  it('rsvpEvent: success', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue({ status: 'Approved', organizer_id: 2, title: 't' });
    EventRsvp.add.mockResolvedValue(true);
    createNotification.mockResolvedValue();
    await eventController.rsvpEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 201, expect.stringContaining('RSVP successful'));
  });
  it('rsvpEvent: error', async () => {
    req.params.id = 1;
    Event.findById.mockRejectedValue(new Error('fail'));
    await eventController.rsvpEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('RSVP failed'));
  });

  // cancelRsvp
  it('cancelRsvp: not RSVPed', async () => {
    req.params.id = 1;
    EventRsvp.remove.mockResolvedValue(false);
    await eventController.cancelRsvp(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, expect.stringContaining('not RSVPed'));
  });
  it('cancelRsvp: success', async () => {
    req.params.id = 1;
    EventRsvp.remove.mockResolvedValue(true);
    Event.findById.mockResolvedValue({ title: 't', organizer_id: 2 });
    createNotification.mockResolvedValue();
    await eventController.cancelRsvp(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('RSVP cancelled successfully'));
  });
  it('cancelRsvp: error', async () => {
    req.params.id = 1;
    EventRsvp.remove.mockRejectedValue(new Error('fail'));
    await eventController.cancelRsvp(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error during canceling RSVP'));
  });

  // getRsvps
  it('getRsvps: success', async () => {
    req.params.id = 1;
    EventRsvp.getByEvent.mockResolvedValue([{ id: 1 }]);
    await eventController.getRsvps(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('RSVP list fetched successfully'), [{ id: 1 }]);
  });
  it('getRsvps: error', async () => {
    req.params.id = 1;
    EventRsvp.getByEvent.mockRejectedValue(new Error('fail'));
    await eventController.getRsvps(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to fetch RSVPs'));
  });

  // getStats
  it('getStats: success', async () => {
    req.params.id = 1;
    EventRsvp.getStats.mockResolvedValue({ count: 5 });
    await eventController.getStats(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Event statistics retrieved successfully'), { count: 5 });
  });
  it('getStats: error', async () => {
    req.params.id = 1;
    EventRsvp.getStats.mockRejectedValue(new Error('fail'));
    await eventController.getStats(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to fetch stats'));
  });

  // getMyEvents
  it('getMyEvents: success', async () => {
    req.user.id = 1;
    db.execute.mockResolvedValue([[{ id: 1 }]]);
    await eventController.getMyEvents(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Events fetched successfully'), [{ id: 1 }]);
  });
  it('getMyEvents: error', async () => {
    req.user.id = 1;
    db.execute.mockRejectedValue(new Error('fail'));
    await eventController.getMyEvents(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while fetching events'));
  });

  // checkMyRsvp
  it('checkMyRsvp: hasRSVPed true', async () => {
    req.params.id = 1;
    req.user.id = 2;
    db.execute.mockResolvedValue([[{ id: 1 }]]);
    await eventController.checkMyRsvp(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('RSVP status checked'), { hasRSVPed: true });
  });
  it('checkMyRsvp: hasRSVPed false', async () => {
    req.params.id = 1;
    req.user.id = 2;
    db.execute.mockResolvedValue([[]]);
    await eventController.checkMyRsvp(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('RSVP status checked'), { hasRSVPed: false });
  });
  it('checkMyRsvp: error', async () => {
    req.params.id = 1;
    req.user.id = 2;
    db.execute.mockRejectedValue(new Error('fail'));
    await eventController.checkMyRsvp(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to check RSVP status'));
  });
}); 