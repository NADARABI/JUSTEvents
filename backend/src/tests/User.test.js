import User from '../models/User.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('User model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create user', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 1 }]);
    const id = await User.create({ name: 'A', email: 'a@b.com', password_hash: 'h' });
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'), expect.any(Array));
    expect(id).toBe(1);
  });

  it('should find by email', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 2, email: 'a@b.com' }]]);
    const row = await User.findByEmail('a@b.com');
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE email = ?'), ['a@b.com']);
    expect(row).toEqual({ id: 2, email: 'a@b.com' });
  });
  it('should return null if not found by email', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const row = await User.findByEmail('a@b.com');
    expect(row).toBeNull();
  });

  it('should find by id', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 3, name: 'B' }]]);
    const row = await User.findById(3);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE id = ?'), [3]);
    expect(row).toEqual({ id: 3, name: 'B' });
  });
  it('should return null if not found by id', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const row = await User.findById(3);
    expect(row).toBeNull();
  });

  it('should get all users', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1 }, { id: 2 }]]);
    const rows = await User.getAllUsers();
    expect(db.execute).toHaveBeenCalledWith('SELECT * FROM users');
    expect(rows).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should check if email is verified', async () => {
    db.execute.mockResolvedValueOnce([[{ is_verified: 1 }]]);
    const verified = await User.isEmailVerified('a@b.com');
    expect(verified).toBe(1);
  });
  it('should return false if email not verified', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const verified = await User.isEmailVerified('a@b.com');
    expect(verified).toBe(false);
  });

  it('should verify email', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await User.verifyEmail('a@b.com');
    expect(affected).toBe(1);
  });

  it('should update verification code', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await User.updateVerificationCode('a@b.com', 'code');
    expect(affected).toBe(1);
  });

  it('should set reset password', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await User.setResetPassword('a@b.com', 'hash');
    expect(affected).toBe(true);
  });

  it('should update password by id', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await User.updatePasswordById(2, 'hash');
    expect(affected).toBe(1);
  });

  it('should update role', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await User.updateRole(2, 'Admin');
    expect(affected).toBe(1);
  });

  it('should store role request', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await User.storeRoleRequest(2, 'Student', 'file.pdf');
    expect(affected).toBe(1);
  });

  it('should get users by role', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, role: 'Admin' }]]);
    const rows = await User.getUsersByRole('Admin');
    expect(rows).toEqual([{ id: 1, role: 'Admin' }]);
  });

  it('should get pending users', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 2, role: 'Pending' }]]);
    const rows = await User.getPendingUsers();
    expect(rows).toEqual([{ id: 2, role: 'Pending' }]);
  });

  it('should soft delete user', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await User.softDeleteUser(2);
    expect(affected).toBe(1);
  });

  it('should update user profile', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await User.updateUserProfile(2, { name: 'Ali', email: 'ali@b.com' });
    expect(affected).toBe(1);
  });

  it('should search by email fragment', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, email: 'a@b.com' }]]);
    const rows = await User.searchByEmailFragment('a@b');
    expect(rows).toEqual([{ id: 1, email: 'a@b.com' }]);
  });

  it('should update last login', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const affected = await User.updateLastLogin(2);
    expect(affected).toBe(1);
  });

  it('should store reset token', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const ok = await User.storeResetToken('a@b.com', 'tok', 'exp');
    expect(ok).toBe(true);
  });

  it('should find by reset token', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, reset_token: 'tok' }]]);
    const row = await User.findByResetToken('tok');
    expect(row).toEqual({ id: 1, reset_token: 'tok' });
  });
  it('should return null if not found by reset token', async () => {
    db.execute.mockResolvedValueOnce([[]]);
    const row = await User.findByResetToken('tok');
    expect(row).toBeNull();
  });

  it('should clear reset token', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const ok = await User.clearResetToken('a@b.com');
    expect(ok).toBe(true);
  });
  it('should not clear reset token if not found', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const ok = await User.clearResetToken('a@b.com');
    expect(ok).toBe(false);
  });
}); 