const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Boolean } = Schema.Types;

// TODO email, confirmed, plus add password recovery and email confirmations
const userSchema = new Schema({
  // TODO do NOT expose emails to any logs or API responses.
  email: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Active'], // Could expand to include 'Banned'
    default: 'Pending',
  },
  confirmationCode: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    set: (x) => x.toLowerCase(), // TODO Should usernames be lowercase? Odd style choice, could just make login not case-sensitive for users
  },
  roles: {
    User: { type: Number, required: false, default: 2001 },
    Editor: { type: Number, required: false },
    Admin: { type: Number, required: false },
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('User', userSchema);
