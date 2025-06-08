import * as approvalController from '../controllers/approvalController.js';
import Approval from '../models/Approval.js';
import Event from '../models/Event.js';
import { createNotification } from '../utils/notificationHelper.js';
import { sendResponse } from '../utils/sendResponse.js';

jest.mock('../models/Approval.js');
jest.mock('../models/Event.js');
jest.mock('../utils/notificationHelper.js');
jest.mock('../utils/sendResponse.js');

describe('approvalController', () => {
  let req, res;
  beforeEach(() => {
    req = { params: {}, body: {}, user: { id: 1 } };
    res = {};
    jest.clearAllMocks();
    Approval.getPending = jest.fn();
    Approval.updateStatus = jest.fn();
    Event.findById = jest.fn();
    Event.updateStatus = jest.fn();
    createNotification.mockResolvedValue();
  });

  // getPendingEvents
  it('getPendingEvents: success', async () => {
    Approval.getPending.mockResolvedValue([{ id: 1 }]);
    await approvalController.getPendingEvents(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.any(String), [{ id: 1 }]);
  });
  it('getPendingEvents: fail', async () => {
    Approval.getPending.mockRejectedValue(new Error('fail'));
    await approvalController.getPendingEvents(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });

  // reviewEvent
  it('reviewEvent: invalid status', async () => {
    req.params.event_id = 1;
    req.body.status = 'Invalid';
    await approvalController.reviewEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 400, 'Invalid approval status');
  });
  it('reviewEvent: event not found', async () => {
    req.params.event_id = 1;
    req.body.status = 'Approved';
    Event.findById.mockResolvedValue(null);
    await approvalController.reviewEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Event not found');
  });
  it('reviewEvent: event not pending', async () => {
    req.params.event_id = 1;
    req.body.status = 'Approved';
    Event.findById.mockResolvedValue({ status: 'Approved' });
    await approvalController.reviewEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 409, expect.stringContaining('already approved'));
  });
  it('reviewEvent: approval record not found', async () => {
    req.params.event_id = 1;
    req.body.status = 'Approved';
    Event.findById.mockResolvedValue({ status: 'Pending' });
    Approval.updateStatus.mockResolvedValue(0);
    await approvalController.reviewEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 404, 'Approval record not found');
  });
  it('reviewEvent: success', async () => {
    req.params.event_id = 1;
    req.body.status = 'Approved';
    req.body.reason = 'ok';
    Event.findById.mockResolvedValue({ status: 'Pending', organizer_id: 2, title: 'Test Event' });
    Approval.updateStatus.mockResolvedValue(1);
    Event.updateStatus.mockResolvedValue();
    createNotification.mockResolvedValue();
    await approvalController.reviewEvent(req, res);
    expect(Event.updateStatus).toHaveBeenCalledWith(1, 'Approved');
    expect(createNotification).toHaveBeenCalledWith(2, expect.stringContaining('approved'), 'success');
    expect(sendResponse).toHaveBeenCalledWith(res, 200, expect.stringContaining('approved successfully'));
  });
  it('reviewEvent: fail', async () => {
    req.params.event_id = 1;
    req.body.status = 'Approved';
    Event.findById.mockRejectedValue(new Error('fail'));
    await approvalController.reviewEvent(req, res);
    expect(sendResponse).toHaveBeenCalledWith(res, 500, expect.any(String));
  });
}); 