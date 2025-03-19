const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Initial test route to confirm setup clearly
app.get('/', (req, res) => {
  res.json({ message: 'Backend setup clearly successful!' });
});

module.exports = app;
