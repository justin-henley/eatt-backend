const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectID } = Schema.Types;

const menuSchema = new Schema({
  restaurant: {
    zhtw: {
      type: String,
      required: true,
      set: (x) => x.toLowerCase(),
    },
    pinyin: {
      type: String,
      required: true,
      set: (x) => x.toLowerCase(),
    },
    en: {
      type: String,
      required: true,
      set: (x) => x.toLowerCase(),
    },
    // Should not be set manually
    // The pre-save middleware strips the diacritics from the pinyin for easier searching
    pinyinNoDiacritics: {
      type: String,
      default: '',
    },
  },
  menu: [
    {
      type: ObjectID,
      ref: 'Dish',
    },
  ],
});

menuSchema.pre('save', function (next) {
  this.restaurant.pinyinNoDiacritics = this.restaurant.pinyin
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s/g, '');

  next();
});

module.exports = mongoose.model('Menu', menuSchema);
