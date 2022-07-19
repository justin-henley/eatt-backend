// Libraries
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Models
const User = require('../model/User');
// Constants
const { refreshTokenMaxAge, refreshTokenExpiresIn, accessTokenExpiresIn } = require('../config/constants');

const handleLogin = async (req, res) => {
  // Get any cookies provided
  const cookies = req.cookies;

  // Check if username and password were provided
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

  // Check if user exists
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  // User found. Evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // User roles
    const roles = Object.values(foundUser.roles);

    // Create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessTokenExpiresIn } // Adjust as needed
    );
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: refreshTokenExpiresIn } // Adjust as needed
    );

    // Remove any refresh tokens currently stored in the jwt cookie
    const newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    // Clear the cookie
    if (cookies.jwt) res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // Comment out 'secure:true' for local development with postman/thunderclient

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
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
