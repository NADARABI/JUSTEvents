import * as campusMapController from '../controllers/CampusMapController.js';
import Building from '../models/Building.js';
import Room from '../models/Room.js';
import Event from '../models/Event.js';
import { sendResponse } from '../utils/sendResponse.js';
import axios from 'axios';

jest.mock('../models/Building.js');
jest.mock('../models/Room.js');
jest.mock('../models/Event.js');
jest.mock('../utils/sendResponse.js');
jest.mock('axios');

describe('CampusMapController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, query: {}, user: {} };
    res = {};
    jest.clearAllMocks();
  });

  // getAllBuildings
  it('getAllBuildings: success', async () => {
    Building.findAll.mockResolvedValue([{ id: 1, name: 'A' }]);
    await campusMapController.getAllBuildings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Buildings fetched successfully', [{ id: 1, name: 'A' }]);
  });

  it('getAllBuildings: fail', async () => {
    Building.findAll.mockRejectedValue(new Error('fail'));
    await campusMapController.getAllBuildings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error while fetching buildings');
  });

  // getRoomsByBuilding
  it('getRoomsByBuilding: success', async () => {
    req.params.id = 1;
    Room.findAll.mockResolvedValue([
      { id: 1, building_id: 1 },
      { id: 2, building_id: 2 }
    ]);
    await campusMapController.getRoomsByBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      'Rooms fetched successfully',
      [{ id: 1, building_id: 1 }]
    );
  });

  it('getRoomsByBuilding: fail', async () => {
    req.params.id = 1;
    Room.findAll.mockRejectedValue(new Error('fail'));
    await campusMapController.getRoomsByBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error while fetching rooms');
  });

  // getEventLocation
  it('getEventLocation: event not found', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue(null);
    await campusMapController.getEventLocation(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Event not found');
  });

  it('getEventLocation: room not found', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue({ id: 1, venue_id: 2 });
    Room.findById.mockResolvedValue(null);
    await campusMapController.getEventLocation(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Venue not found');
  });

  it('getEventLocation: building not found', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue({ id: 1, venue_id: 2 });
    Room.findById.mockResolvedValue({ id: 2, building_id: 3 });
    Building.findById.mockResolvedValue(null);
    await campusMapController.getEventLocation(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Building not found');
  });

  it('getEventLocation: success', async () => {
    req.params.id = 1;
    const event = { id: 1, venue_id: 2 };
    const room = { id: 2, building_id: 3 };
    const building = { id: 3, name: 'B' };
    Event.findById.mockResolvedValue(event);
    Room.findById.mockResolvedValue(room);
    Building.findById.mockResolvedValue(building);
    await campusMapController.getEventLocation(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Event location fetched successfully', { event, room, building });
  });

  it('getEventLocation: fail', async () => {
    req.params.id = 1;
    Event.findById.mockRejectedValue(new Error('fail'));
    await campusMapController.getEventLocation(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error while fetching event location');
  });

  // getNavigationPath
  it('getNavigationPath: missing endId/type', async () => {
    req.query = {};
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Missing required parameters: endId and type');
  });

  it('getNavigationPath: invalid type', async () => {
    req.query = { endId: 1, type: 'invalid' };
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Invalid type. Must be "building" or "room".');
  });

  it('getNavigationPath: building not found', async () => {
    req.query = { endId: 1, type: 'building', origin: '1,2' };
    Building.findById.mockResolvedValue(null);
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Building not found or has no coordinates');
  });

  it('getNavigationPath: room not found', async () => {
    req.query = { endId: 1, type: 'room', origin: '1,2' };
    Room.findById.mockResolvedValue(null);
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Room not found or has no coordinates');
  });

  it('getNavigationPath: missing origin/startId', async () => {
    req.query = { endId: 1, type: 'building' };
    Building.findById.mockResolvedValue({ map_coordinates: { x: 1, y: 2 } });
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Either origin or startId must be provided');
  });

  it('getNavigationPath: invalid coordinates', async () => {
    req.query = { endId: 1, type: 'building', origin: 'invalid,coords' };
    Building.findById.mockResolvedValue({ map_coordinates: { x: 1, y: 2 } });
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Invalid or missing coordinates');
  });

  it('getNavigationPath: start location not found', async () => {
    req.query = { endId: 1, type: 'building', startId: 2 };
    Building.findById
      .mockResolvedValueOnce({ map_coordinates: { x: 1, y: 2 } }) // end
      .mockResolvedValueOnce(null); // start
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Start location not found or has no coordinates');
  });

  it('getNavigationPath: start location missing coordinates', async () => {
    req.query = { endId: 1, type: 'building', startId: 2 };
    Building.findById
      .mockResolvedValueOnce({ map_coordinates: { x: 1, y: 2 } }) // end
      .mockResolvedValueOnce({}); // start missing map_coordinates
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Start location not found or has no coordinates');
  });

  it('getNavigationPath: Google Maps API fail', async () => {
    req.query = { endId: 1, type: 'building', origin: '1,2' };
    Building.findById.mockResolvedValue({ map_coordinates: { x: 1, y: 2 } });
    axios.get.mockResolvedValue({ data: { status: 'NOT_OK' } });
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Google Maps API failed', { status: 'NOT_OK' });
  });

  it('getNavigationPath: success', async () => {
    req.query = { endId: 1, type: 'building', origin: '1,2' };
    Building.findById.mockResolvedValue({ map_coordinates: { x: 1, y: 2 } });
    axios.get.mockResolvedValue({ data: { status: 'OK', routes: [{ path: 'test' }] } });
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, 'Path fetched successfully', { path: 'test' });
  });

  it('getNavigationPath: fail', async () => {
    req.query = { endId: 1, type: 'building', origin: '1,2' };
    Building.findById.mockResolvedValue({ map_coordinates: { x: 1, y: 2 } });
    axios.get.mockRejectedValue(new Error('fail'));
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, 'Server error while fetching navigation path');
  });
});