const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectID } = Schema.Types;

const dishSchema = new Schema({
  zhtw: String,
  taigi: String,
  en: String,
  meat: {
    type: ObjectID,
    ref: 'meats',
  },
  category: {
    type: ObjectID,
    ref: 'categories',
  },
});

module.exports = mongoose.model('Dish', dishSchema);
