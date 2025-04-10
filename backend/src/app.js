// src/app.js
import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/admin', adminRoutes); // Final route: /admin/pending-users etc.
app.use('/auth', authRoutes);

// Initial test route to confirm setup clearly
app.get('/', (req, res) => {
  res.json({ message: 'Backend setup clearly successful!' });
});

export default app;