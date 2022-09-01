// Libraries
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Configured mailer
const nodemailer = require('../config/nodemailer.config');
// Models
const User = require('../model/User');

// TODO add passwordd regex to backend to enforce password strength
// TODO consider removing password composition rules in favor of greater length - https://jdlt.co.uk/blog/password-security-in-2022/

const handleNewUser = async (req, res) => {
  // Check if username and password were provided
  const { user, pwd, email } = req.body;
  if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

  // Check for duplicate usernames or emails in database. Both should be unique.
  const duplicateUser = await User.findOne({ username: user }).exec();
  const duplicateEmail = await User.findOne({ email: email }).exec();
  if (duplicateUser || duplicateEmail)
    return res.status(409).json({ message: `${duplicateEmail ? 'Email' : 'Username'} already in use.` }); // Conflict
  try {
    // Encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // Create a confirmation code
    const conf = jwt.sign({ email: email }, process.env.CONFIRM_CODE_SECRET);

    // Create new user entry
    const result = await User.create({
      username: user,
      password: hashedPwd,
      email: email,
      confirmationCode: conf,
    });

    // Request succeeded if it reaches this line, so send the email
    nodemailer.sendConfirmationEmail(user, email, conf);

    // Respond with success
    res.status(201).json({ message: `New user ${user} created. Please check your email for a confirmation link.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyUser = async (req, res) => {
  // Find the user from the verification code
  const user = await User.findOne({ confirmationCode: req.params.confirmationCode });
  // User Not Found
  if (!user) return res.status(404).json({ message: 'User not found.' });
  // User found, but already activated
  if (user.status === 'Active') return res.status(409).json({ message: 'User already activated.' });

  user.status = 'Active';
  try {
    // Save the modified user
    const result = await user.save();

    // Announce success
    return res.status(200).json({ message: 'User confirmed, you may log in.' });
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` });
  }
};

module.exports = { handleNewUser, verifyUser };
