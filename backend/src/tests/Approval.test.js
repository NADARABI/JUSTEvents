import Approval from '../models/Approval.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('Approval model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new approval', async () => {
    db.execute.mockResolvedValueOnce([]);
    await Approval.create('Event', 123);
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO approvals'),
      [null, 'Event', 123]
    );
  });

  it('should update approval status', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await Approval.updateStatus({
      entity_type: 'Event',
      entity_id: 123,
      admin_id: 1,
      status: 'Approved',
      reason: 'ok',
    });
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE approvals'),
      ['Approved', 'ok', 1, 'Event', 123]
    );
    expect(affected).toBe(1);
  });

  it('should update approval status with null reason', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await Approval.updateStatus({
      entity_type: 'Event',
      entity_id: 123,
      admin_id: 1,
      status: 'Rejected',
    });
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE approvals'),
      ['Rejected', null, 1, 'Event', 123]
    );
    expect(affected).toBe(1);
  });

  it('should get approval by entity', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, entity_type: 'Event', entity_id: 123 }]]);
    const result = await Approval.getByEntity('Event', 123);
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM approvals'),
      ['Event', 123]
    );
    expect(result).toEqual({ id: 1, entity_type: 'Event', entity_id: 123 });
  });

  it('should get pending approvals for event', async () => {
    db.execute.mockResolvedValueOnce([
      [
        { approval_id: 1, status: 'Pending', event_id: 2, title: 't', date: 'd', organizer_name: 'n' }
      ]
    ]);
    const result = await Approval.getPending('Event');
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('JOIN events'));
    expect(result).toEqual([
      { approval_id: 1, status: 'Pending', event_id: 2, title: 't', date: 'd', organizer_name: 'n' }
    ]);
  });

  it('should get pending approvals for non-event entity', async () => {
    db.execute.mockResolvedValueOnce([
      [
        { id: 3, entity_type: 'Room', entity_id: 5, status: 'Pending' }
      ]
    ]);
    const result = await Approval.getPending('Room');
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('SELECT * FROM approvals WHERE LOWER(entity_type)'),
      ['room']
    );
    expect(result).toEqual([
      { id: 3, entity_type: 'Room', entity_id: 5, status: 'Pending' }
    ]);
  });
}); 