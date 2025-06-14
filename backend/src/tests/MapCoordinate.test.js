import MapCoordinate from '../models/MapCoordinate.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('MapCoordinate model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find all coordinates', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1 }]]);
    const rows = await MapCoordinate.findAll();
    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM map_coordinates');
    expect(rows).toEqual([{ id: 1 }]);
  });

  it('should find by building id', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 2, building_id: 3 }]]);
    const rows = await MapCoordinate.findByBuildingId(3);
    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM map_coordinates WHERE building_id = ?', [3]);
    expect(rows).toEqual([{ id: 2, building_id: 3 }]);
  });

  it('should find by id', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 4 }]]);
    const row = await MapCoordinate.findById(4);
    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM map_coordinates WHERE id = ?', [4]);
    expect(row).toEqual({ id: 4 });
  });
  it('should return null if not found by id', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const row = await MapCoordinate.findById(5);
    expect(row).toBeNull();
  });

  describe('create', () => {
    it('should throw if building already has coordinates', async () => {
      db.execute.mockResolvedValueOnce([[{ id: 1 }]]);
      await expect(MapCoordinate.create({ building_id: 1, x: 1, y: 2, level: 0 })).rejects.toThrow(/already has coordinates/);
    });
    it('should insert new coordinates if not exists', async () => {
      db.execute.mockResolvedValueOnce([[]]);
      db.execute.mockResolvedValueOnce([{ insertId: 7 }]);
      const id = await MapCoordinate.create({ building_id: 2, x: 1, y: 2, level: 0 });
      expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO map_coordinates'), [2, 1, 2, 0]);
      expect(id).toBe(7);
    });
  });

  describe('update', () => {
    it('should return null if coordinate does not exist', async () => {
      jest.spyOn(MapCoordinate, 'findById').mockResolvedValueOnce(null);
      const res = await MapCoordinate.update(1, { x: 1 });
      expect(res).toBeNull();
    });
    it('should update and return updated coordinate', async () => {
      const original = { id: 1 };
      const updated = { id: 1, x: 5 };
      jest.spyOn(MapCoordinate, 'findById')
        .mockResolvedValueOnce(original)
        .mockResolvedValueOnce(updated);
      db.execute.mockResolvedValueOnce();
      const res = await MapCoordinate.update(1, { building_id: 2, x: 5, y: 6, level: 1 });
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE map_coordinates'),
        [2, 5, 6, 1, 1]
      );
      expect(res).toBe(updated);
    });
  });

  it('should delete coordinate (success)', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const ok = await MapCoordinate.delete(1);
    expect(db.execute).toHaveBeenCalledWith('DELETE FROM map_coordinates WHERE id = ?', [1]);
    expect(ok).toBe(true);
  });
  it('should not delete coordinate (fail)', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const ok = await MapCoordinate.delete(1);
    expect(ok).toBe(false);
  });
}); 