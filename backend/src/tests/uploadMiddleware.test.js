import multer from 'multer';
import path from 'path';
import fs from 'fs';

jest.mock('fs');
jest.mock('path');

// إعادة تحميل upload بعد mocks
let upload;
beforeAll(() => {
  fs.existsSync.mockReturnValue(true); // لمنع إنشاء مجلد فعلي
  path.extname.mockImplementation((filename) => {
    const match = filename.match(/\.[^.]+$/);
    return match ? match[0].toLowerCase() : '';
  });
  upload = require('../middlewares/uploadMiddleware.js').default;
});

describe('uploadMiddleware', () => {
  it('should accept allowed file types (jpg, png, pdf)', (done) => {
    const allowed = ['test.jpg', 'test.jpeg', 'test.png', 'test.pdf'];
    const req = {};
    allowed.forEach((filename) => {
      const file = { originalname: filename };
      upload.fileFilter(req, file, (err, accept) => {
        expect(err).toBeNull();
        expect(accept).toBe(true);
      });
    });
    done();
  });

  it('should reject disallowed file types', (done) => {
    const disallowed = ['test.exe', 'test.gif', 'test.txt'];
    const req = {};
    disallowed.forEach((filename) => {
      const file = { originalname: filename };
      upload.fileFilter(req, file, (err, accept) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toMatch(/Invalid file type/);
        expect(accept).toBe(false);
      });
    });
    done();
  });

  it('should generate filename with event- and correct extension', (done) => {
    const req = {};
    const file = { originalname: 'myfile.JPG' };
    // mock Date.now
    const now = 1234567890;
    jest.spyOn(Date, 'now').mockReturnValue(now);
    upload.storage.getFilename(req, file, (err, filename) => {
      expect(filename).toBe(`event-${now}.jpg`);
      Date.now.mockRestore();
      done();
    });
  });

  it('should set destination to uploads folder', (done) => {
    const req = {};
    const file = { originalname: 'any.jpg' };
    upload.storage.getDestination(req, file, (err, dest) => {
      expect(dest).toBe('uploads');
      done();
    });
  });

  it('should set file size limit to 5MB', () => {
    expect(upload.limits.fileSize).toBe(5 * 1024 * 1024);
  });
}); 