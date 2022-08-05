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
    // Ensure user has confirmed their account
    if (foundUser.status !== 'Active') {
      return res
        .status(401)
        .send({ message: 'Pending account. Please click the verification link we sent to your email address.' });
    }
    // User roles
    const roles = Object.values(foundUser.roles).filter(Boolean);

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
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    // Clear the cookie
    if (cookies?.jwt) {
      /*
        1 Possible Scenario:
          1) User logs in but never uses Refresh Token and does not logout
          2) Refresh Token is stolen
          3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in

          If someone stole the refresh token and the user never used it, they could generate new RTs. These must all be cleared out if detected, otherwise the attacker could remain logged in
          The stolen token is in the users cookie sent at login, then would be found to be missing from DB because it was already used by an attacker
      */

      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        console.log('Attempted refresh token reuse at login!');
        // Clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // Comment out 'secure:true' for local development with postman/thunderclient
    }

    // Save refreshToken with current user to database
    // Allows invalidating the refresh token if the user logs out before the refresh token expires
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    // Send refreshToken as httpOnly cookie, which is NOT available to JavaScript
    // Shows up in "set-cookie" response header
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true, // Comment out 'secure:true' for local development with postman/thunderclient
      maxAge: refreshTokenMaxAge,
      expiresIn: refreshTokenExpiresIn,
    });

    res.json({ roles, accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
