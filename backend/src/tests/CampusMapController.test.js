import * as campusMapController from '../controllers/CampusMapController.js';
import Building from '../models/Building.js';
import Room from '../models/Room.js';
import MapCoordinate from '../models/MapCoordinate.js';
import Event from '../models/Event.js';
import { sendResponse } from '../utils/sendResponse.js';
import axios from 'axios';

jest.mock('../models/Building.js');
jest.mock('../models/Room.js');
jest.mock('../models/MapCoordinate.js');
jest.mock('../models/Event.js');
jest.mock('../utils/sendResponse.js');
jest.mock('axios');

describe('CampusMapController', () => {
  let req, res;
  beforeEach(() => {
    req = { params: {}, query: {}, user: {} };
    res = {};
    jest.clearAllMocks();
    Building.findAll = jest.fn();
    Building.findById = jest.fn();
    Room.findAll = jest.fn();
    Room.findById = jest.fn();
    MapCoordinate.findAll = jest.fn();
    Event.findById = jest.fn();
    axios.get = jest.fn();
  });

  // getAllBuildings
  it('getAllBuildings: success', async () => {
    Building.findAll.mockResolvedValue([{ id: 1 }]);
    await campusMapController.getAllBuildings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('fetched successfully'), [{ id: 1 }]);
  });
  it('getAllBuildings: fail', async () => {
    Building.findAll.mockRejectedValue(new Error('fail'));
    await campusMapController.getAllBuildings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while fetching buildings'));
  });

  // getRoomsByBuilding
  it('getRoomsByBuilding: success (admin sees all)', async () => {
    req.params.id = 1;
    req.user.role = 'Campus Admin';
    Room.findAll.mockResolvedValue([{ id: 1, building_id: 1, status: 'Available' }, { id: 2, building_id: 1, status: 'Unavailable' }]);
    await campusMapController.getRoomsByBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Rooms fetched successfully'), expect.any(Array));
  });
  it('getRoomsByBuilding: success (visitor sees only available)', async () => {
    req.params.id = 1;
    req.user.role = 'Visitor';
    Room.findAll.mockResolvedValue([{ id: 1, building_id: 1, status: 'Available' }, { id: 2, building_id: 1, status: 'Unavailable' }]);
    await campusMapController.getRoomsByBuilding(req, res);
    const filtered = [{ id: 1, building_id: 1, status: 'Available' }];
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Rooms fetched successfully'), filtered);
  });
  it('getRoomsByBuilding: fail', async () => {
    Room.findAll.mockRejectedValue(new Error('fail'));
    await campusMapController.getRoomsByBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while fetching rooms'));
  });

  // getMapMarkers
  it('getMapMarkers: success', async () => {
    MapCoordinate.findAll.mockResolvedValue([{ id: 1, building_id: 2, x: 10, y: 20, level: 1 }]);
    await campusMapController.getMapMarkers(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Map markers fetched successfully'), [{ id: 1, building_id: 2, x: 10, y: 20, level: 1 }]);
  });
  it('getMapMarkers: fail', async () => {
    MapCoordinate.findAll.mockRejectedValue(new Error('fail'));
    await campusMapController.getMapMarkers(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while fetching map markers'));
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
    Event.findById.mockResolvedValue({ venue_id: 2 });
    Room.findById.mockResolvedValue(null);
    await campusMapController.getEventLocation(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Venue not found');
  });
  it('getEventLocation: building not found', async () => {
    req.params.id = 1;
    Event.findById.mockResolvedValue({ venue_id: 2 });
    Room.findById.mockResolvedValue({ building_id: 3 });
    Building.findById.mockResolvedValue(null);
    await campusMapController.getEventLocation(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Building not found');
  });
  it('getEventLocation: success', async () => {
    req.params.id = 1;
    const event = { id: 1, venue_id: 2 };
    const room = { id: 2, building_id: 3 };
    const building = { id: 3 };
    Event.findById.mockResolvedValue(event);
    Room.findById.mockResolvedValue(room);
    Building.findById.mockResolvedValue(building);
    await campusMapController.getEventLocation(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Event location fetched successfully'), { event, room, building });
  });
  it('getEventLocation: fail', async () => {
    req.params.id = 1;
    Event.findById.mockRejectedValue(new Error('fail'));
    await campusMapController.getEventLocation(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while fetching event location'));
  });

  // getNavigationPath
  it('getNavigationPath: missing params', async () => {
    req.query = { type: undefined, endId: undefined };
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, expect.stringContaining('Missing required parameters'));
  });
  it('getNavigationPath: invalid type', async () => {
    req.query = { type: 'invalid', endId: 1 };
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, expect.stringContaining('Invalid type parameter'));
  });
  it('getNavigationPath: end building not found', async () => {
    req.query = { type: 'building', endId: 1 };
    Building.findById.mockResolvedValue(null);
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Building not found');
  });
  it('getNavigationPath: end room not found', async () => {
    req.query = { type: 'room', endId: 1 };
    Room.findById.mockResolvedValue(null);
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Room not found');
  });
  it('getNavigationPath: missing start', async () => {
    req.query = { type: 'building', endId: 1 };
    Building.findById.mockResolvedValue({ map_coordinates: { x: 1, y: 2 } });
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, expect.stringContaining('Either origin or startId must be provided'));
  });
  it('getNavigationPath: invalid coordinates', async () => {
    req.query = { type: 'building', endId: 1, startId: 2 };
    Building.findById.mockResolvedValueOnce({ map_coordinates: { x: 1, y: 2 } }).mockResolvedValueOnce({ map_coordinates: { x: 999, y: 999 } });
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, expect.stringContaining('Invalid or missing coordinates'));
  });
  it('getNavigationPath: google maps fail', async () => {
    req.query = { type: 'building', endId: 1, startId: 2 };
    Building.findById.mockResolvedValueOnce({ map_coordinates: { x: 1, y: 2 } }).mockResolvedValueOnce({ map_coordinates: { x: 3, y: 4 } });
    axios.get.mockResolvedValue({ data: { status: 'NOT_OK' } });
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Google Maps API failed'), { status: 'NOT_OK' });
  });
  it('getNavigationPath: success', async () => {
    req.query = { type: 'building', endId: 1, startId: 2 };
    Building.findById.mockResolvedValueOnce({ map_coordinates: { x: 1, y: 2 } }).mockResolvedValueOnce({ map_coordinates: { x: 3, y: 4 } });
    axios.get.mockResolvedValue({ data: { status: 'OK', routes: ['route1'] } });
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('Path fetched successfully'), 'route1');
  });
  it('getNavigationPath: fail', async () => {
    req.query = { type: 'building', endId: 1, startId: 2 };
    Building.findById.mockRejectedValue(new Error('fail'));
    await campusMapController.getNavigationPath(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Server error while fetching navigation path'));
  });
}); 