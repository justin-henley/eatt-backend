require('dotenv').config();
const express = require('express');
const app = express();
// const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to MongoDb
connectDB();

// Use CORS - Currently allowing all origins
app.use(cors());

// Middleware to handle url-encoded form data
app.use(express.urlencoded({ extended: false }));

// Middleware for JSON
app.use(express.json());

// static files?

// routes
app.use('/', require('./routes/root'));

// api endpoints
app.use('/dishes', require('./routes/api/dishes'));
app.use('/menus', require('./routes/api/menus'));
app.use('/restaurants', require('./routes/api/restaurants'));

// Universal 404 page
app.all('*', (req, res) => {
  // Set response code
  res.status(404);
  // Send response as JSON
  res.json({ message: '404 Not Found' });
  // TODO an HTML version
});

// Announce successful database connection in console
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
