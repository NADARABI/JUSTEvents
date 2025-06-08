import RefreshToken from '../models/RefreshToken.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('RefreshToken model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save refresh token', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 21 }]);
    const id = await RefreshToken.save(1, 'tok');
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO refresh_tokens'),
      [1, 'tok']
    );
    expect(id).toBe(21);
  });

  it('should find by token', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 2, token: 'tok' }]]);
    const row = await RefreshToken.findByToken('tok');
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE token = ?'), ['tok']);
    expect(row).toEqual({ id: 2, token: 'tok' });
  });
  it('should return undefined if token not found', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const row = await RefreshToken.findByToken('tok');
    expect(row).toBeUndefined();
  });

  it('should delete token (success)', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const ok = await RefreshToken.delete('tok');
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM refresh_tokens'), ['tok']);
    expect(ok).toBe(true);
  });
  it('should not delete token (fail)', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const ok = await RefreshToken.delete('tok');
    expect(ok).toBe(false);
  });
}); 