import { sendResponse } from '../utils/sendResponse.js';

describe('sendResponse', () => {
  let res;
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should send a success response with data', () => {
    sendResponse(res, 200, 'ok', { foo: 'bar' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'ok',
      data: { foo: 'bar' },
    });
  });

  it('should send a failure response with null data', () => {
    sendResponse(res, 400, 'fail');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'fail',
      data: null,
    });
  });
}); 