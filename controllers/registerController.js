// Libraries
const bcrypt = require('bcrypt');
// Models
const User = require('../model/User');

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

    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    // Respond with success
    res.status(201).json({ message: `New user ${user} created.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
