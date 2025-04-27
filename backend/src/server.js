// src/server.js
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config(); // Load environment variables clearly

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server clearly running on port ${PORT}`);
});
