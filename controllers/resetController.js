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
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'UserId required' });

  // Check if that user exists
  try {
    const foundUser = await User.findById(userId).exec();
    if (!foundUser) return res.status(400).json({ message: 'Invalid user ID' });
  } catch (error) {
    // Handles cating errors of userId to mongoose ObjectID type
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  // Check if a reset token already exists for that user
  const foundToken = await ResetToken.findOne({ userId: userId }).exec();
  if (foundToken) return res.status(409).json({ message: 'Reset token already exists for this user.' });

  // Generate a reset token
  const resetToken = jwt.sign(
    {
      userId: userId,
    },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  try {
    // Store the reset token
    const storedToken = await ResetToken.create({
      userId: userId,
      token: resetToken,
    });

    // Send the reset token to the user's email
    console.log(foundUser.username, foundUser.email, foundUser);
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
    if (err) return res.status(403).json('Invalid or expired token.');
    // Get userId from token
    reqToken.userId = decoded.userId;
  });

  try {
    // Search ResetTokens collection for this user with this token that has not expired
    const foundToken = await ResetToken.findOne({ userId: reqToken.userId });
    // Token not found
    if (!foundToken) return res.status(403).json({ message: 'Invalid or expired token.' });

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
