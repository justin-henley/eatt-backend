// Libraries
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Models
const User = require('../model/User');

const handleLogin = async (req, res) => {
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
      { expiresIn: '30s' } // TODO set the higher for production
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' } // TODO Check if appropriate for production
    );

    // Save refreshToken with current user to database
    // Allows invalidating the refresh token if the user logs out before the refresh token expires
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    // Send refreshToken as httpOnly cookie, which is NOT available to JavaScript
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      /* secure: true, */ //TODO uncomment for server
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
