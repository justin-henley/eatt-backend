// Libraries
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Models
const User = require('../model/User');
const ResetToken = require('../model/ResetToken');
// Utilities and Constants
const { sendPasswordResetEmail } = require('../config/nodemailer.config');
const { resetTokenExpiresIn } = require('../config/constants');

const generateReset = async (req, res) => {
  // Get userId from request
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'User email address required' });

  // Check if that user exists

  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) return res.status(400).json({ message: 'Invalid email address' });

  // Check if a reset token already exists for that user
  const foundToken = await ResetToken.findOne({ userId: foundUser._id }).exec();
  if (foundToken) return res.status(409).json({ message: 'Reset token already exists for this user.' });

  // Generate a reset token
  const resetToken = jwt.sign(
    {
      userId: foundUser._id,
    },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  try {
    // Store the reset token
    const storedToken = await ResetToken.create({
      userId: foundUser._id,
      token: resetToken,
    });

    // Send the reset token to the user's email
    sendPasswordResetEmail(foundUser.username, foundUser.email, resetToken);

    // Respond with success
    res.status(201).json({ message: 'Reset token sent.' });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

const handleReset = async (req, res) => {
  // Decrypt the resetToken and pull the userId
  const reqToken = { token: req.params.resetToken };
  jwt.verify(reqToken.token, process.env.RESET_TOKEN_SECRET, (err, decoded) => {
    // Error
    if (err) {
      reqToken.err = true;
    } else {
      // Get userId from token
      reqToken.userId = decoded.userId;
    }
  });

  // Return if the token could not be decoded
  if (reqToken.err) return res.status(403).json('Invalid or expired token.');

  // Search ResetTokens collection for this user with this token that has not expired
  const foundToken = await ResetToken.findOne({ userId: reqToken.userId });
  // Token not found
  if (!foundToken) return res.status(403).json({ message: 'Invalid or expired token.' });

  try {
    // If found, reset user password to the one in the request
    const user = await User.findById(foundToken.userId).exec(); // Find user

    const hashedNewPwd = await bcrypt.hash(req.body.pwd, 10); // Encrypt the password
    user.password = hashedNewPwd; // Replace the password
    await user.save(); // Save the user

    // Delete the token from the collection
    await foundToken.delete();

    // Announce success
    return res.status(200).json({ message: 'Password updated. You may now log in with your new password.' });
  } catch (error) {
    return res.status(500).json({ message: `Error: ${error}` });
  }
};

module.exports = { generateReset, handleReset };
