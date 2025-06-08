import * as mapCoordinateController from '../controllers/MapCoordinateController.js';
import MapCoordinate from '../models/MapCoordinate.js';
import { sendResponse } from '../utils/sendResponse.js';

jest.mock('../models/MapCoordinate.js');
jest.mock('../utils/sendResponse.js');

describe('MapCoordinateController', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {};
    jest.clearAllMocks();
    MapCoordinate.create = jest.fn();
    MapCoordinate.update = jest.fn();
    MapCoordinate.findById = jest.fn();
    MapCoordinate.delete = jest.fn();
  });

  // createCoordinate
  it('createCoordinate: success', async () => {
    MapCoordinate.create.mockResolvedValue(1);
    await mapCoordinateController.createCoordinate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 201, expect.stringContaining('created successfully'), { id: 1 });
  });
  it('createCoordinate: duplicate', async () => {
    MapCoordinate.create.mockRejectedValue(new Error('already has coordinates'));
    await mapCoordinateController.createCoordinate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, expect.stringContaining('already has coordinates'));
  });
  it('createCoordinate: error', async () => {
    MapCoordinate.create.mockRejectedValue(new Error('fail'));
    await mapCoordinateController.createCoordinate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to create coordinate'));
  });

  // updateCoordinate
  it('updateCoordinate: not found', async () => {
    MapCoordinate.update.mockResolvedValue(false);
    req.params.id = 1;
    await mapCoordinateController.updateCoordinate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Coordinate not found');
  });
  it('updateCoordinate: success', async () => {
    MapCoordinate.update.mockResolvedValue({ id: 1 });
    req.params.id = 1;
    await mapCoordinateController.updateCoordinate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('updated successfully'), { id: 1 });
  });
  it('updateCoordinate: error', async () => {
    MapCoordinate.update.mockRejectedValue(new Error('fail'));
    req.params.id = 1;
    await mapCoordinateController.updateCoordinate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to update coordinate'));
  });

  // deleteCoordinate
  it('deleteCoordinate: not found', async () => {
    MapCoordinate.findById.mockResolvedValue(null);
    req.params.id = 1;
    await mapCoordinateController.deleteCoordinate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Coordinate not found');
  });
  it('deleteCoordinate: delete fail', async () => {
    MapCoordinate.findById.mockResolvedValue({ id: 1 });
    MapCoordinate.delete.mockResolvedValue(false);
    req.params.id = 1;
    await mapCoordinateController.deleteCoordinate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to delete coordinate'));
  });
  it('deleteCoordinate: success', async () => {
    MapCoordinate.findById.mockResolvedValue({ id: 1 });
    MapCoordinate.delete.mockResolvedValue(true);
    req.params.id = 1;
    await mapCoordinateController.deleteCoordinate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('deleted successfully'));
  });
  it('deleteCoordinate: error', async () => {
    MapCoordinate.findById.mockRejectedValue(new Error('fail'));
    req.params.id = 1;
    await mapCoordinateController.deleteCoordinate(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to delete coordinate'));
  });
}); 