const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId, mongooseDate = Date } = Schema.Types;

const tokenSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: mongooseDate,
    expires: 900,
  },
});

tokenSchema.pre('save', function (next) {
  this.createdAt = Date.now();
  next();
});

module.exports = mongoose.model('resetToken', tokenSchema);
