const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;
const app = require('./app');
const connectDB = require('./config/dbConn');

// Connect to MongoDb
connectDB();

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
