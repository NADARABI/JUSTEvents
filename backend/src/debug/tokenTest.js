import jwt from 'jsonwebtoken';

const JWT_SECRET = 'justevents-secret';

const payload = {
  id: 1,
  email: 'test@example.com',
  role: 'Organizer',
  name: 'Test Organizer'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
console.log("Token:", token);

const decoded = jwt.verify(token, JWT_SECRET);
console.log("Decoded:", decoded);
