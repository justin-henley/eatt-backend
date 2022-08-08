// Libraries
const { request } = require('express');
const { sendStatus } = require('express/lib/response');
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  // Get the auth header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Ensure an auth header exists with a bearer token
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // Unauthorized
  // Split off the word 'Bearer' and take just the token string
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden. Invalid token.
    // Username and roles are appended to the request
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
