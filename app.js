require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
// const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
// const connectDB = require('./config/dbConn');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const logger = require('morgan');
// const PORT = process.env.PORT || 3500;

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Connect to MongoDb
// connectDB();

// Log HTTP requests
app.use(logger('dev'));

// Add credentials header flag before hitting CORS
app.use(credentials);

// Use CORS - Currently allowing only localhost and front end origins
// TODO this is definitely allowing all origins. Is credentials messing it up with the allowed-origins header?
app.use(cors(corsOptions));
// Adds status 200 to options to satisfy preflight checks
app.options('/*', (_, res) => {
  res.sendStatus(200);
});

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
app.use('/account', require('./routes/api/account'));

// Universal 404 page
app.all('*', (req, res) => {
  // Send HTML or JSON
  if (req.accepts('html')) {
    res.render('error', { title: '404', message: 'Not Found' });
  } else {
    // Set response code and send response as JSON
    res.status(404).json({ message: '404 Not Found' });
  }
});

// Announce successful database connection in console
/* mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}); */
module.exports = app;
