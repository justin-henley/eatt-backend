// Libraries
const jwt = require('jsonwebtoken');
// Models
const User = require('../model/User');

const handleRefreshToken = async (req, res) => {
  // Check if the jwt cookie was provided
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  // Check if refresh token exists for some user
  const foundUser = await User.findOne({ refreshToken: refreshToken }).select('username refreshToken -_id').exec();
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // User found. Evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    // Reject
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
      { expiresIn: '30,' } // Adjust as needed
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
