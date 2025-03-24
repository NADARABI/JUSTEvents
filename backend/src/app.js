// src/app.js
import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

// Initial test route to confirm setup clearly
app.get('/', (req, res) => {
  res.json({ message: 'Backend setup clearly successful!' });
});

export default app;
