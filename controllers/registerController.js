const User = require('../model/User');

/* const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require('fs').promises;
const path = require('path'); */

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  // Check if username and password were provided
  const { user, pwd } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

  // Check for duplicate usernames in database
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); // Conflict
  try {
    // Encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // Create new user entry
    console.log('creating user...');
    const result = await User.create({
      username: user,
      roles: { User: 2001 },
      password: hashedPwd,
      refreshToken: null,
    });
    console.log('user created');
    // Respond with success
    res.status(201).json({ message: `New user ${user} created.` });

    /* usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(usersDB.users));

    res.status(201).json({ message: `New user ${user} created.` }); */
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
