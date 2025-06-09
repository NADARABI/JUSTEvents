import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('dbTest.js', () => {
  let logSpy, errorSpy;
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('should log success message if db query works', async () => {
    db.query.mockResolvedValueOnce([[{ result: 2 }]]);
    const { default: runTest } = await import('../utils/dbTest.js');
    // Wait for the async function to finish
    await new Promise((r) => setTimeout(r, 10));
    expect(logSpy).toHaveBeenCalledWith('Database connection is working:', 2);
  });

  it('should log error message if db query fails', async () => {
    db.query.mockRejectedValueOnce(new Error('fail'));
    const { default: runTest } = await import('../utils/dbTest.js');
    // Wait for the async function to finish
    await new Promise((r) => setTimeout(r, 10));
    expect(errorSpy).toHaveBeenCalledWith('Error testing database connection:', 'fail');
  });
}); 