const User = require('../model/User');

const jwt = require('jsonwebtoken');
require('dotenv').config();

/* const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
}; */

const handleRefreshToken = async (req, res) => {
  // Check if the jwt cookie was provided
  const cookies = req.cookies;
  console.log('refresh cookie: ', cookies);

  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  // Check if refresh token exists for some user
  const foundUser = await User.findOne({ refreshToken: refreshToken }).select('username refreshToken -_id').exec();
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // User found. Evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    // Reject
    console.log(foundUser.username, decoded.username, foundUser);
    if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

    // Accept
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' } // TODO set longer for production
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
