const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String } = Schema.Types;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    set: (x) => x.toLowerCase(),
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
  refreshToken: [String],
});

module.exports = mongoose.model('User', userSchema);
