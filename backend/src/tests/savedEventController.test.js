import * as savedEventController from '../controllers/savedEventController.js';
import db from '../utils/db.js';
import SavedEvent from '../models/SavedEvent.js';
import { sendResponse } from '../utils/sendResponse.js';

jest.mock('../utils/db.js');
jest.mock('../models/SavedEvent.js');
jest.mock('../utils/sendResponse.js');

describe('savedEventController', () => {
  let req, res;
  beforeEach(() => {
    req = { params: { id: '1', userId: '2' }, user: { id: 2 }, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('saveEvent', () => {
    it('should save event successfully', async () => {
      db.execute
        .mockResolvedValueOnce([[{ id: 1, status: 'Approved' }]]) // event exists and approved
        .mockResolvedValueOnce([[]]); // not already saved
      SavedEvent.save.mockResolvedValue();
      await savedEventController.saveEvent(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 201, 'Event saved successfully');
    });
    it('should return 404 if event not found', async () => {
      db.execute.mockResolvedValueOnce([[]]);
      await savedEventController.saveEvent(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Event not found');
    });
    it('should return 403 if event not approved', async () => {
      db.execute.mockResolvedValueOnce([[{ id: 1, status: 'Pending' }]]);
      await savedEventController.saveEvent(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 403, 'Cannot save unapproved event');
    });
    it('should return 409 if event already saved', async () => {
      db.execute
        .mockResolvedValueOnce([[{ id: 1, status: 'Approved' }]])
        .mockResolvedValueOnce([[{ id: 1 }]]);
      await savedEventController.saveEvent(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 409, 'Event already saved');
    });
    it('should handle errors', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      await savedEventController.saveEvent(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error while saving event');
    });
  });

  describe('unsaveEvent', () => {
    it('should unsave event successfully', async () => {
      db.execute.mockResolvedValueOnce([[{ id: 1 }]]);
      SavedEvent.remove.mockResolvedValue();
      await savedEventController.unsaveEvent(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Event unsaved successfully');
    });
    it('should return 404 if event is not saved', async () => {
      db.execute.mockResolvedValueOnce([[]]);
      await savedEventController.unsaveEvent(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'This event is not saved');
    });
    it('should handle errors', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      await savedEventController.unsaveEvent(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error while unsaving event');
    });
  });

  describe('getSavedEvents', () => {
    it('should fetch saved events successfully', async () => {
      SavedEvent.getSavedByUser.mockResolvedValue([{ id: 1 }]);
      await savedEventController.getSavedEvents(req, res);
      expect(SavedEvent.getSavedByUser).toHaveBeenCalledWith(2);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Saved events fetched successfully', [{ id: 1 }]);
    });
    it('should handle errors', async () => {
      SavedEvent.getSavedByUser.mockRejectedValue(new Error('fail'));
      await savedEventController.getSavedEvents(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error while fetching saved events');
    });
  });

  describe('getSavedEventsCount', () => {
    it('should fetch saved events count successfully', async () => {
      db.execute.mockResolvedValueOnce([[{ count: 3 }]]);
      await savedEventController.getSavedEventsCount(req, res);
      expect(db.execute).toHaveBeenCalledWith(
        'SELECT COUNT(*) AS count FROM saved_events WHERE user_id = ?',
        ['2']
      );
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Saved events count fetched successfully', { count: 3 });
    });
    it('should return 0 if no saved events', async () => {
      db.execute.mockResolvedValueOnce([[{}]]);
      await savedEventController.getSavedEventsCount(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Saved events count fetched successfully', { count: 0 });
    });
    it('should handle errors', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      await savedEventController.getSavedEventsCount(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error while fetching saved events count');
    });
  });
}); 