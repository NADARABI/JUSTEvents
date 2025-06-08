import Building from '../models/Building.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('Building model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find all buildings', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, name: 'A' }]]);
    const rows = await Building.findAll();
    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM buildings');
    expect(rows).toEqual([{ id: 1, name: 'A' }]);
  });

  it('should find building by id', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 2, name: 'B' }]]);
    const row = await Building.findById(2);
    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM buildings WHERE id = ?', [2]);
    expect(row).toEqual({ id: 2, name: 'B' });
  });

  it('should return null if building by id not found', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const row = await Building.findById(3);
    expect(row).toBeNull();
  });

  it('should create a building', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 5 }]);
    const id = await Building.create({ name: 'C', location: 'L', map_coordinates: { x: 1 } });
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO buildings'),
      ['C', 'L', JSON.stringify({ x: 1 })]
    );
    expect(id).toBe(5);
  });

  describe('update', () => {
    it('should return null if building does not exist', async () => {
      jest.spyOn(Building, 'findById').mockResolvedValueOnce(null);
      const res = await Building.update(1, { name: 'X' });
      expect(res).toBeNull();
    });
    it('should return original if no fields to update', async () => {
      const original = { id: 1, name: 'A' };
      jest.spyOn(Building, 'findById').mockResolvedValueOnce(original);
      const res = await Building.update(1, {});
      expect(res).toBe(original);
    });
    it('should update fields and return updated building', async () => {
      const original = { id: 1, name: 'A' };
      const updated = { id: 1, name: 'B' };
      jest.spyOn(Building, 'findById')
        .mockResolvedValueOnce(original)
        .mockResolvedValueOnce(updated);
      db.execute.mockResolvedValueOnce();
      const res = await Building.update(1, { name: 'B' });
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE buildings SET name = ? WHERE id = ?'),
        ['B', 1]
      );
      expect(res).toBe(updated);
    });
  });

  it('should delete building (success)', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const ok = await Building.delete(1);
    expect(db.execute).toHaveBeenCalledWith('DELETE FROM buildings WHERE id = ?', [1]);
    expect(ok).toBe(true);
  });
  it('should not delete building (fail)', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const ok = await Building.delete(1);
    expect(ok).toBe(false);
  });
}); 