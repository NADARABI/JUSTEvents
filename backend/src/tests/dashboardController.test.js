import * as dashboardController from '../controllers/dashboardController.js';
import db from '../utils/db.js';
import User from '../models/User.js';
import { sendResponse } from '../utils/sendResponse.js';

jest.mock('../utils/db.js');
jest.mock('../models/User.js');
jest.mock('../utils/sendResponse.js');

describe('dashboardController', () => {
  let req, res;
  beforeEach(() => {
    req = { params: { id: 1 }, user: { id: 1, role: 'Organizer' } };
    res = {};
    jest.clearAllMocks();
    db.execute = jest.fn();
    User.findById = jest.fn();
  });

  it('should deny access if user is not the organizer', async () => {
    req.user = { id: 2, role: 'Organizer' };
    await dashboardController.getOrganizerSummary(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 403, 'Access denied');
  });

  it('should deny access if user is not an organizer', async () => {
    req.user = { id: 1, role: 'Visitor' };
    await dashboardController.getOrganizerSummary(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 403, 'Access denied');
  });

  it('should return 404 if organizer not found', async () => {
    User.findById.mockResolvedValue(null);
    await dashboardController.getOrganizerSummary(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Organizer not found');
  });

  it('should return 404 if user is not organizer', async () => {
    User.findById.mockResolvedValue({ id: 1, role: 'Visitor' });
    await dashboardController.getOrganizerSummary(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Organizer not found');
  });

  it('should return summary successfully', async () => {
    User.findById.mockResolvedValue({ id: 1, role: 'Organizer' });
    db.execute
      .mockResolvedValueOnce([[{ total_events: 3 }]])
      .mockResolvedValueOnce([[{ total_rsvps: 10 }]])
      .mockResolvedValueOnce([[{ avg_rating: 4.25 }]]);
    await dashboardController.getOrganizerSummary(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Dashboard summary fetched', {
      total_events: 3,
      total_rsvps: 10,
      avg_rating: 4.25,
    });
  });

  it('should return summary with avg_rating 0 if null', async () => {
    User.findById.mockResolvedValue({ id: 1, role: 'Organizer' });
    db.execute
      .mockResolvedValueOnce([[{ total_events: 3 }]])
      .mockResolvedValueOnce([[{ total_rsvps: 10 }]])
      .mockResolvedValueOnce([[{ avg_rating: null }]]);
    await dashboardController.getOrganizerSummary(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Dashboard summary fetched', {
      total_events: 3,
      total_rsvps: 10,
      avg_rating: 0,
    });
  });

  it('should handle errors', async () => {
    User.findById.mockResolvedValue({ id: 1, role: 'Organizer' });
    db.execute.mockRejectedValue(new Error('fail'));
    await dashboardController.getOrganizerSummary(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to load summary');
  });
}); 