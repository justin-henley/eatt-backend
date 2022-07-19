const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  // Credentials if provided
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  } else {
    // Allow all origins for non-credentialed requests
    // TODO should this be handled in the cors middleware?
    res.header('Access-Control-Allow-Origin', '*');
  }

  next();
};

module.exports = credentials;
