import * as buildingController from '../controllers/BuildingController.js';
import db from '../utils/db.js';
import { sendResponse } from '../utils/sendResponse.js';

jest.mock('../utils/db.js');
jest.mock('../utils/sendResponse.js');

describe('BuildingController', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {};
    jest.clearAllMocks();
    db.execute = jest.fn();
  });

  // getAllBuildings
  it('getAllBuildings: success', async () => {
    db.execute.mockResolvedValue([[{ id: 1, name: 'A' }]]);
    await buildingController.getAllBuildings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('fetched successfully'), [{ id: 1, name: 'A' }]);
  });
  it('getAllBuildings: fail', async () => {
    db.execute.mockRejectedValue(new Error('fail'));
    await buildingController.getAllBuildings(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to fetch buildings'));
  });

  // createBuilding
  it('createBuilding: missing name', async () => {
    req.body = {};
    await buildingController.createBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Building name is required');
  });
  it('createBuilding: success', async () => {
    req.body = { name: 'B' };
    db.execute.mockResolvedValue([{ insertId: 2 }]);
    await buildingController.createBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 201, expect.stringContaining('created successfully'), { id: 2 });
  });
  it('createBuilding: fail', async () => {
    req.body = { name: 'B' };
    db.execute.mockRejectedValue(new Error('fail'));
    await buildingController.createBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to create building'));
  });

  // updateBuilding
  it('updateBuilding: not found', async () => {
    req.params = { id: 1 };
    req.body = { name: 'C' };
    db.execute.mockResolvedValue([{ affectedRows: 0 }]);
    await buildingController.updateBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Building not found');
  });
  it('updateBuilding: success', async () => {
    req.params = { id: 1 };
    req.body = { name: 'C' };
    db.execute.mockResolvedValue([{ affectedRows: 1 }]);
    await buildingController.updateBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('updated successfully'));
  });
  it('updateBuilding: fail', async () => {
    req.params = { id: 1 };
    req.body = { name: 'C' };
    db.execute.mockRejectedValue(new Error('fail'));
    await buildingController.updateBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to update building'));
  });

  // deleteBuilding
  it('deleteBuilding: not found', async () => {
    req.params = { id: 1 };
    db.execute.mockResolvedValue([{ affectedRows: 0 }]);
    await buildingController.deleteBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Building not found');
  });
  it('deleteBuilding: success', async () => {
    req.params = { id: 1 };
    db.execute.mockResolvedValue([{ affectedRows: 1 }]);
    await buildingController.deleteBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('deleted successfully'));
  });
  it('deleteBuilding: fail', async () => {
    req.params = { id: 1 };
    db.execute.mockRejectedValue(new Error('fail'));
    await buildingController.deleteBuilding(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.stringContaining('Failed to delete building'));
  });
}); 