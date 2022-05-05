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
    enum: ['Beef', 'Pork', 'Bird', 'Fish', 'Veg', 'Unknown', 'Other', null],
    required: true,
  },
  category: {
    type: String,
    enum: [
      'Rice',
      'Noodle',
      'Bread',
      'Soup',
      'Drink',
      'Unknown',
      'Other',
      null,
    ],
    required: true,
  },
  taigi: {
    type: String,
  },
  en: {
    type: String,
  },
});

module.exports = mongoose.model('Dish', dishSchema);
