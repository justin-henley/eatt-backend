// Models
const User = require('../model/User');

const handleLogout = async (req, res) => {
  // TODO On client (front end), ALSO delete the access token

  // Check if the jwt cookie was provided
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  // Check if refresh token exists for some user
  const foundUser = await User.findOne({ refreshToken: refreshToken }).select('username refreshToken ').exec();

  // User found in DB
  if (foundUser) {
    // Delete the found refresh token from database
    foundUser.refreshToken = '';
    const result = await foundUser.save(); // unused var
  }

  // Clear the cookie
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // Comment out 'secure:true' for local development with postman/thunderclient
  res.sendStatus(204); // No content
};

module.exports = { handleLogout };
