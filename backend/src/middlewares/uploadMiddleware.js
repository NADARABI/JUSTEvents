import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads folder exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `event-${Date.now()}${ext}`);
  }
});

// Add file type filtering
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type: Only JPG, PNG, or PDF allowed'), false);
  }
};

// Pass fileFilter + sizeLimit inside multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});

export default upload;
