// Libraries
const jwt = require('jsonwebtoken');
// Models
const User = require('../model/User');
// Constants
const { refreshTokenMaxAge, refreshTokenExpiresIn, accessTokenExpiresIn } = require('../config/constants');

const handleRefreshToken = async (req, res) => {
  // Check if the jwt cookie was provided
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  // Delete the cookie (refresh token rotation)
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // Comment out 'secure:true' for local development with postman/thunderclient

  // Check if refresh token exists for some user
  const foundUser = await User.findOne({ refreshToken: refreshToken }).select('username refreshToken -_id').exec();

  // Detected refresh token reuse
  // If no user is found with this refresh token, that token has already been used and invalidated
  // It must have been captured maliciously and someone is attempting to reuse it
  if (!foundUser) {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403); // Forbidden (Expired)
      // If the refresh token has been captured and reuses, decode the username and delete all refresh tokens for that user
      const hackedUser = await User.findOne({ username: decoded.username }).exec();
      hackedUser.refreshToken = [];
      const result = await hackedUser.save();
    });

    return res.sendStatus(403); // Forbidden
  }

  // User found
  // Keep all refresh tokens except the one that was just used.  Allows for a refresh token for each user device (multiple devices logged in at once)
  const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);

  // Evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    // Reject
    if (err) {
      foundUser.refreshToken = [...newRefreshTokenArray];
      const result = await foundUser.save();
    }
    if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

    // Accept: Refresh token was still valid
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessTokenExpiresIn } // Adjust as needed
    );

    // Create a new refresh token for this user and device
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: refreshTokenExpiresIn } // Adjust as needed
    );

    // Save refreshToken with current user to database
    // Allows invalidating the refresh token if the user logs out before the refresh token expires
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    // Send refreshToken as httpOnly cookie, which is NOT available to JavaScript
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true, // Comment out 'secure:true' for local development with postman/thunderclient
      maxAge: refreshTokenMaxAge,
    });

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
