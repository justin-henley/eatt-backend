const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectID } = Schema.Types;

const dishSchema = new Schema({
  zhtw: {
    type: String,
    required: true,
  },
  pinyin: {
    type: String,
    required: true,
  },
  meat: {
    type: ObjectID,
    ref: 'meats',
    // required: true,
  },
  category: {
    type: ObjectID,
    ref: 'categories',
    // required: true,
  },
  taigi: {
    type: String,
  },
  en: {
    type: String,
  },
});

module.exports = mongoose.model('Dish', dishSchema);
