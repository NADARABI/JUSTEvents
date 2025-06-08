import Room from '../models/Room.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('Room model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find all rooms', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, name: 'A' }]]);
    const rows = await Room.findAll();
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('FROM rooms r'));
    expect(rows).toEqual([{ id: 1, name: 'A' }]);
  });

  it('should find room by id', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 2, name: 'B' }]]);
    const row = await Room.findById(2);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE r.id = ?'), [2]);
    expect(row).toEqual({ id: 2, name: 'B' });
  });
  it('should return null if room by id not found', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const row = await Room.findById(3);
    expect(row).toBeNull();
  });

  it('should create a room', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 5 }]);
    const id = await Room.create({ name: 'C', building_id: 1, capacity: 10, type: 'T', status: 'S', description: 'D', floor: 2, map_coordinates: { x: 1 } });
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO rooms'),
      ['C', 1, 10, 'T', 'S', 'D', 2, JSON.stringify({ x: 1 })]
    );
    expect(id).toBe(5);
  });

  describe('update', () => {
    it('should update fields and return updated room', async () => {
      const updated = { id: 1, name: 'B' };
      jest.spyOn(Room, 'findById').mockResolvedValueOnce(updated);
      db.execute.mockResolvedValueOnce();
      const res = await Room.update(1, { name: 'B', map_coordinates: { x: 2 } });
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE rooms SET name = ?, map_coordinates = ? WHERE id = ?'),
        ['B', JSON.stringify({ x: 2 }), 1]
      );
      expect(res).toBe(updated);
    });
    it('should return original if no fields to update', async () => {
      const original = { id: 1, name: 'A' };
      jest.spyOn(Room, 'findById').mockResolvedValueOnce(original);
      const res = await Room.update(1, {});
      expect(res).toBe(original);
    });
  });

  it('should delete room (success)', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const ok = await Room.delete(1);
    expect(db.execute).toHaveBeenCalledWith('DELETE FROM rooms WHERE id = ?', [1]);
    expect(ok).toBe(true);
  });
  it('should not delete room (fail)', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const ok = await Room.delete(1);
    expect(ok).toBe(false);
  });
}); 