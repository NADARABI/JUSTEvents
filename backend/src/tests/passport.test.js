process.env.GOOGLE_CLIENT_ID = 'dummy';
process.env.GOOGLE_CLIENT_SECRET = 'dummy';
process.env.MICROSOFT_CLIENT_ID = 'dummy';
process.env.MICROSOFT_CLIENT_SECRET = 'dummy';
process.env.MICROSOFT_CALLBACK_URL = 'http://localhost:5000/auth/microsoft/callback';

import passport from 'passport';
import User from '../models/User.js';

jest.mock('../models/User.js');

const findStrategy = (name) => passport._strategy(name);

beforeAll(async () => {
  await import('../middlewares/passport.js');
});

describe('GoogleStrategy', () => {
  let done;
  beforeEach(() => {
    done = jest.fn();
    jest.clearAllMocks();
  });

  it('should fail if no email in profile', async () => {
    const strategy = findStrategy('google');
    const profile = { emails: [], displayName: 'Test User' };
    await strategy._verify('access', 'refresh', profile, done);
    expect(done).toHaveBeenCalledWith(null, false, { message: expect.stringContaining('No email') });
  });

  it('should find existing user by email', async () => {
    const strategy = findStrategy('google');
    const user = { id: 1, name: 'Test', email: 'a@b.com' };
    User.findByEmail.mockResolvedValue(user);
    const profile = { emails: [{ value: 'a@b.com' }], displayName: 'Test User' };
    await strategy._verify('access', 'refresh', profile, done);
    expect(User.findByEmail).toHaveBeenCalledWith('a@b.com');
    expect(done).toHaveBeenCalledWith(null, user);
  });

  it('should create new user if not found', async () => {
    const strategy = findStrategy('google');
    User.findByEmail.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce(123);
    const createdUser = { id: 123, name: 'Test User', email: 'a@b.com' };
    User.findById.mockResolvedValueOnce(createdUser);
    const profile = { emails: [{ value: 'a@b.com' }], displayName: 'Test User' };
    await strategy._verify('access', 'refresh', profile, done);
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'a@b.com', name: 'Test User', provider: 'Google' }));
    expect(done).toHaveBeenCalledWith(null, createdUser);
  });

  it('should handle errors and call done with error', async () => {
    const strategy = findStrategy('google');
    User.findByEmail.mockRejectedValueOnce(new Error('fail'));
    const profile = { emails: [{ value: 'a@b.com' }], displayName: 'Test User' };
    await strategy._verify('access', 'refresh', profile, done);
    expect(done).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('MicrosoftStrategy', () => {
  let done;
  beforeEach(() => {
    done = jest.fn();
    jest.clearAllMocks();
  });

  it('should find existing user by email', async () => {
    const strategy = findStrategy('microsoft');
    const user = { id: 2, name: 'Ms User', email: 'ms@just.edu.jo' };
    User.findByEmail.mockResolvedValue(user);
    const profile = { emails: [{ value: 'ms@just.edu.jo' }], displayName: 'Ms User' };
    await strategy._verify('access', 'refresh', profile, done);
    expect(User.findByEmail).toHaveBeenCalledWith('ms@just.edu.jo');
    expect(done).toHaveBeenCalledWith(null, user);
  });

  it('should create new user with Student role if email is just.edu.jo', async () => {
    const strategy = findStrategy('microsoft');
    User.findByEmail.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce(456);
    const createdUser = { id: 456, name: 'Ms User', email: 'ms@just.edu.jo', role: 'Student' };
    User.findById.mockResolvedValueOnce(createdUser);
    const profile = { emails: [{ value: 'ms@just.edu.jo' }], displayName: 'Ms User' };
    await strategy._verify('access', 'refresh', profile, done);
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'ms@just.edu.jo', role: 'Student', provider: 'Microsoft' }));
    expect(done).toHaveBeenCalledWith(null, createdUser);
  });

  it('should create new user with Pending role if email is not just.edu.jo', async () => {
    const strategy = findStrategy('microsoft');
    User.findByEmail.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce(789);
    const createdUser = { id: 789, name: 'Other', email: 'other@gmail.com', role: 'Pending' };
    User.findById.mockResolvedValueOnce(createdUser);
    const profile = { emails: [{ value: 'other@gmail.com' }], displayName: 'Other' };
    await strategy._verify('access', 'refresh', profile, done);
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'other@gmail.com', role: 'Pending', provider: 'Microsoft' }));
    expect(done).toHaveBeenCalledWith(null, createdUser);
  });

  it('should handle errors and call done with error', async () => {
    const strategy = findStrategy('microsoft');
    User.findByEmail.mockRejectedValueOnce(new Error('fail'));
    const profile = { emails: [{ value: 'ms@just.edu.jo' }], displayName: 'Ms User' };
    await strategy._verify('access', 'refresh', profile, done);
    expect(done).toHaveBeenCalledWith(expect.any(Error));
  });
}); 