const jwt = require('jsonwebtoken');
require('dotenv').config();

const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleRefreshToken = (req, res) => {
  // Check if the jwt cookie was provided
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  // Check if refresh token exists for some user
  const foundUser = usersDB.users.find((person) => person.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // User found. Evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' } // TODO set longer for production
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
