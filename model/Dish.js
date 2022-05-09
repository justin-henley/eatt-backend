const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String } = Schema.Types;

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
    type: String,
    enum: ['beef', 'pork', 'bird', 'fish', 'veg', 'unknown', 'other', null],
    required: true,
  },
  category: {
    type: String,
    enum: [
      'rice',
      'noodle',
      'bread',
      'soup',
      'drink',
      'unknown',
      'other',
      null,
    ],
    //required: true,
  },
  taigi: {
    type: String,
  },
  en: {
    type: String,
  },
});

module.exports = mongoose.model('Dish', dishSchema);
