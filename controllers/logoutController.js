const User = require('../model/User');

// TODO Replace with DB
/* const fsPromises = require('fs').promises;
const path = require('path');

const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
}; */

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
    /* const otherUsers = usersDB.users.filter((person) => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users)); */
    foundUser.refreshToken = '';
    const result = await foundUser.save();
  }

  // Clear the cookie
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' /* , secure: true */ }); // TODO uncomment for server, cannot do secure on localhost
  res.sendStatus(204); // No content
};

module.exports = { handleLogout };
