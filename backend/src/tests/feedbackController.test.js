import * as feedbackController from '../controllers/feedbackController.js';
import db from '../utils/db.js';
import Feedback from '../models/Feedback.js';
import { sendResponse } from '../utils/sendResponse.js';
import { createNotification } from '../utils/notificationHelper.js';

jest.mock('../utils/db.js');
jest.mock('../models/Feedback.js');
jest.mock('../utils/sendResponse.js');
jest.mock('../utils/notificationHelper.js');

describe('feedbackController', () => {
  let req, res;
  beforeEach(() => {
    req = { params: { id: 1 }, user: { id: 2 }, body: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
    db.execute = jest.fn();
    db.query = jest.fn();
    Feedback.create = jest.fn();
    Feedback.getByEvent = jest.fn();
    createNotification.mockResolvedValue();
  });

  // addFeedback
  it('addFeedback: missing fields', async () => {
    req.body = { comment: '', rating: undefined };
    await feedbackController.addFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Comment and rating are required');
  });
  it('addFeedback: invalid rating', async () => {
    req.body = { comment: 'test', rating: 6 };
    await feedbackController.addFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Rating must be a number between 1 and 5');
  });
  it('addFeedback: comment too long', async () => {
    req.body = { comment: 'a'.repeat(501), rating: 4 };
    await feedbackController.addFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Comment must be 500 characters or less');
  });
  it('addFeedback: event not found', async () => {
    req.body = { comment: 'ok', rating: 4 };
    db.execute.mockResolvedValueOnce([[]]);
    await feedbackController.addFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Event not found');
  });
  it('addFeedback: event not approved', async () => {
    req.body = { comment: 'ok', rating: 4 };
    db.execute.mockResolvedValueOnce([[{ id: 1, status: 'Pending' }]]);
    await feedbackController.addFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 403, 'Cannot submit feedback for unapproved events');
  });
  it('addFeedback: already submitted', async () => {
    req.body = { comment: 'ok', rating: 4 };
    db.execute
      .mockResolvedValueOnce([[{ id: 1, status: 'Approved', organizer_id: 3, title: 't' }]])
      .mockResolvedValueOnce([[{ id: 1 }]]);
    await feedbackController.addFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 409, 'You have already submitted feedback for this event');
  });
  it('addFeedback: success', async () => {
    req.body = { comment: 'ok', rating: 4 };
    db.execute
      .mockResolvedValueOnce([[{ id: 1, status: 'Approved', organizer_id: 3, title: 't' }]])
      .mockResolvedValueOnce([[]]);
    Feedback.create.mockResolvedValue();
    createNotification.mockResolvedValue();
    await feedbackController.addFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 201, 'Feedback submitted successfully');
  });
  it('addFeedback: error', async () => {
    req.body = { comment: 'ok', rating: 4 };
    db.execute.mockRejectedValue(new Error('fail'));
    await feedbackController.addFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while submitting feedback'));
  });

  // deleteFeedback
  it('deleteFeedback: not found', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    await feedbackController.deleteFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, expect.stringContaining('Feedback not found'));
  });
  it('deleteFeedback: success', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1 }]]).mockResolvedValueOnce();
    await feedbackController.deleteFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Feedback deleted successfully'));
  });
  it('deleteFeedback: error', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await feedbackController.deleteFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while deleting feedback'));
  });

  // editFeedback
  it('editFeedback: missing fields', async () => {
    req.body = { comment: '', rating: undefined };
    await feedbackController.editFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Comment and rating are required');
  });
  it('editFeedback: invalid rating', async () => {
    req.body = { comment: 'ok', rating: 6 };
    await feedbackController.editFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Rating must be between 1 and 5');
  });
  it('editFeedback: comment too long', async () => {
    req.body = { comment: 'a'.repeat(501), rating: 4 };
    await feedbackController.editFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Comment must be 500 characters or less');
  });
  it('editFeedback: not found', async () => {
    req.body = { comment: 'test', rating: 4 };
    db.execute.mockResolvedValueOnce([[]]);
    await feedbackController.editFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, expect.stringContaining('Feedback not found or access denied'));
  });
  it('editFeedback: success', async () => {
    req.body = { comment: 'test', rating: 4 };
    db.execute.mockResolvedValueOnce([[{ id: 1 }]]).mockResolvedValueOnce();
    await feedbackController.editFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Feedback updated successfully'));
  });
  it('editFeedback: error', async () => {
    req.body = { comment: 'test', rating: 4 };
    db.execute.mockRejectedValue(new Error('fail'));
    await feedbackController.editFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while updating feedback'));
  });

  // getFeedback
  it('getFeedback: event not found', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    await feedbackController.getFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Event not found');
  });
  it('getFeedback: event not approved', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, status: 'Pending' }]]);
    await feedbackController.getFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 403, expect.stringContaining('Feedback is not available'));
  });
  it('getFeedback: success', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, status: 'Approved' }]]);
    Feedback.getByEvent.mockResolvedValue([{ id: 1 }]);
    await feedbackController.getFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Feedback fetched successfully'), [{ id: 1 }]);
  });
  it('getFeedback: error', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await feedbackController.getFeedback(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while fetching feedback'));
  });

  // getRecentFeedbackPublic
  it('getRecentFeedbackPublic: success', async () => {
    db.query.mockResolvedValue([[{ comment: 'c', user_name: 'u' }]]);
    await feedbackController.getRecentFeedbackPublic(req, res);
    expect(res.json).toHaveBeenCalledWith([{ comment: 'c', user_name: 'u' }]);
  });
  it('getRecentFeedbackPublic: error', async () => {
    db.query.mockRejectedValue(new Error('fail'));
    await feedbackController.getRecentFeedbackPublic(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: expect.stringContaining('Server error while loading feedback') });
  });
}); 