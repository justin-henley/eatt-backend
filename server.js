require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;

// Connect to MongoDb
connectDB();

// Add credentials header flag before hitting CORS
app.use(credentials);

// Use CORS - Currently allowing only localhost and front end origins
// TODO this is definitely allowing all origins. Is credentials messing it up with the allowed-origins header?
app.use(cors(corsOptions));

// Middleware to handle url-encoded form data
app.use(express.urlencoded({ extended: false }));

// Middleware for JSON
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// static files?

// routes
app.use('/', require('./routes/root'));

// auth routes
app.use('/register', require('./routes/auth/register'));
app.use('/auth', require('./routes/auth/auth'));
app.use('/refresh', require('./routes/auth/refresh'));
app.use('/logout', require('./routes/auth/logout'));
app.use('/reset', require('./routes/auth/reset'));

// api endpoints
app.use('/dishes', require('./routes/api/dishes'));
app.use('/menus', require('./routes/api/menus'));
/* app.use('/restaurants', require('./routes/api/restaurants')); */
app.use('/changelogs', require('./routes/api/changelogs'));

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
