const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectID } = Schema.Types;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    set: (x) => x.toLowerCase(),
  },
  roles: {
    User: { type: Number, required: false },
    Editor: { type: Number, required: false },
    Admin: { type: Number, required: false },
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
