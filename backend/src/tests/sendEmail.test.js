import sendEmail from '../utils/sendEmail.js';

jest.mock('nodemailer');

const mockSendMail = jest.fn();
const mockCreateTransport = jest.fn(() => ({ sendMail: mockSendMail }));
import nodemailer from 'nodemailer';
nodemailer.createTransport = mockCreateTransport;

describe('sendEmail', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, EMAIL_HOST: 'smtp.test', EMAIL_PORT: '587', EMAIL_USER: 'user', EMAIL_PASS: 'pass' };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should send email and return true on success', async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: '123' });
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const result = await sendEmail('to@test.com', 'subject', '<b>hi</b>');
    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: 'smtp.test',
      port: '587',
      secure: false,
      auth: { user: 'user', pass: 'pass' },
    });
    expect(mockSendMail).toHaveBeenCalledWith({
      from: '"JUSTEvents Service" <user>',
      to: 'to@test.com',
      subject: 'subject',
      html: '<b>hi</b>',
    });
    expect(logSpy).toHaveBeenCalledWith('Email sent successfully: 123');
    expect(result).toBe(true);
    logSpy.mockRestore();
  });

  it('should log error and return false on failure', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('fail'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const result = await sendEmail('to@test.com', 'subject', '<b>hi</b>');
    expect(errorSpy).toHaveBeenCalledWith('Error sending email to to@test.com: fail');
    expect(result).toBe(false);
    errorSpy.mockRestore();
  });
}); 