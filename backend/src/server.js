const app = require('./app');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables clearly

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server clearly running on port ${PORT}`);
});
