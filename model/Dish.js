const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, MongooseDate = Date } = Schema.Types;

const dishSchema = new Schema({
  zhtw: {
    type: String,
    required: true,
    unique: true,
    set: (x) => x.toLowerCase(),
  },
  pinyin: {
    type: String,
    required: true,
    set: (x) => x.toLowerCase(),
  },
  meat: {
    type: String,
    enum: ['beef', 'pork', 'bird', 'fish', 'veg', 'egg', 'unknown', 'other', 'none', null],
    //required: true,
  },
  category: {
    type: String,
    enum: ['rice', 'noodle', 'bread', 'soup', 'drink', 'unknown', 'other', null],
    //required: true,
  },
  taigi: {
    type: String,
  },
  en: {
    type: String,
    set: (x) => x.toLowerCase(),
  },
  // Should not be set manually
  // The pre-save middleware strips the diacritics from the pinyin for easier searching
  pinyinNoDiacritics: {
    type: String,
    default: '',
  },
  history: {
    creator: {
      type: String,
      required: true,
    },
    createdDate: {
      type: MongooseDate,
    },
    // TODO make sure this is written correctly
  },
});

// Set date to current time, and strip diacritics from pinyin
dishSchema.pre('save', function (next) {
  this.pinyinNoDiacritics = this.pinyin
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s/g, '');

  this.history.createdDate = Date.now();
  next();
});

module.exports = mongoose.model('Dish', dishSchema);
