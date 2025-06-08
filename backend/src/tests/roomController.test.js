import * as roomController from '../controllers/roomController.js';
import db from '../utils/db.js';
import { sendResponse } from '../utils/sendResponse.js';

jest.mock('../utils/db.js');
jest.mock('../utils/sendResponse.js');

describe('roomController', () => {
  let req, res;
  beforeEach(() => {
    req = { params: { id: '1' }, body: {}, user: { id: 1 } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('getAllRooms', () => {
    it('should fetch all rooms successfully', async () => {
      db.execute.mockResolvedValue([[{ id: 1, name: 'Room 1' }]]);
      await roomController.getAllRooms(req, res);
      expect(db.execute).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Rooms fetched successfully', [{ id: 1, name: 'Room 1' }]);
    });
    it('should handle errors', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      await roomController.getAllRooms(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to fetch rooms');
    });
  });

  describe('createRoom', () => {
    beforeEach(() => {
      req.body = { name: 'Room 1', building_id: 2, capacity: 10, type: 'Study Room', status: 'Available' };
    });
    it('should create a room successfully', async () => {
      db.execute.mockResolvedValue([{ insertId: 5 }]);
      await roomController.createRoom(req, res);
      expect(db.execute).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(res, 201, 'Room created successfully', { id: 5 });
    });
    it('should return 400 if required fields are missing', async () => {
      req.body = { name: '', building_id: null, capacity: null };
      await roomController.createRoom(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Name, capacity, and building ID are required');
    });
    it('should handle errors', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      await roomController.createRoom(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to create room');
    });
  });

  describe('getRoomBasicInfo', () => {
    it('should fetch room info successfully', async () => {
      db.execute.mockResolvedValue([[{ name: 'Room 1', building: 'Building A' }]]);
      await roomController.getRoomBasicInfo(req, res);
      expect(db.execute).toHaveBeenCalledWith(expect.any(String), ['1']);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Room info fetched successfully', { name: 'Room 1', building: 'Building A' });
    });
    it('should return 404 if room not found', async () => {
      db.execute.mockResolvedValue([[]]);
      await roomController.getRoomBasicInfo(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Room not found');
    });
    it('should handle errors', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      await roomController.getRoomBasicInfo(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to fetch room info');
    });
  });

  describe('updateRoom', () => {
    beforeEach(() => {
      req.body = { name: 'Room 1', capacity: 10, type: 'Study Room', status: 'Available', building_id: 2 };
    });
    it('should update room successfully', async () => {
      db.execute.mockResolvedValue([{ affectedRows: 1 }]);
      await roomController.updateRoom(req, res);
      expect(db.execute).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Room updated successfully');
    });
    it('should return 400 if required fields are missing', async () => {
      req.body = { name: '', capacity: null, building_id: null };
      await roomController.updateRoom(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Name, capacity, and building ID are required');
    });
    it('should return 404 if room not found', async () => {
      db.execute.mockResolvedValue([{ affectedRows: 0 }]);
      await roomController.updateRoom(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Room not found');
    });
    it('should handle errors', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      await roomController.updateRoom(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to update room');
    });
  });

  describe('deleteRoom', () => {
    it('should delete room successfully', async () => {
      db.execute.mockResolvedValue([{ affectedRows: 1 }]);
      await roomController.deleteRoom(req, res);
      expect(db.execute).toHaveBeenCalledWith('DELETE FROM rooms WHERE id = ?', ['1']);
      expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Room deleted successfully');
    });
    it('should return 404 if room not found', async () => {
      db.execute.mockResolvedValue([{ affectedRows: 0 }]);
      await roomController.deleteRoom(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Room not found');
    });
    it('should handle errors', async () => {
      db.execute.mockRejectedValue(new Error('fail'));
      await roomController.deleteRoom(req, res);
      expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Failed to delete room');
    });
  });
}); 