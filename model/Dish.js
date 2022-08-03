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
    enum: ['beef', 'pork', 'bird', 'fish', 'veg', 'egg', 'unknown', 'other', null],
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
  // TODO add user and timestamp of creation/modification. Maybe array for mods
  // Should not be set manually
  // The pre-save middleware strips the diacritics from the pinyin for easier searching
  pinyinNoDiacritics: {
    type: String,
    default: '',
  },
  createdDate: {
    type: MongooseDate,
  },
  creator: {
    type: String,
    required: true,
  },
});

// Set date to current time, and strip diacritics from pinyin
dishSchema.pre('save', function (next) {
  this.pinyinNoDiacritics = this.pinyin
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s/g, '');

  this.createdDate = Date.now();
  next();
});

module.exports = mongoose.model('Dish', dishSchema);
