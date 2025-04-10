// src/app.js
import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/admin', adminRoutes); // Final route: /admin/pending-users etc.

// Initial test route to confirm setup clearly
app.get('/', (req, res) => {
  res.json({ message: 'Backend setup clearly successful!' });
});

export default app;