const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectID } = Schema.Types;

const menuSchema = new Schema({
  creator: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
  },
  restaurant: {
    zhtw: {
      type: String,
      required: true,
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
  // Menu is divided into named sections. Sections should be labelled with zhtw, en, and pinyin. No need to strip pinyin for searching
  menu: [
    {
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
      items: [{ type: ObjectID, ref: 'Dish' }],
    },
  ],
});

menuSchema.pre('save', function (next) {
  this.restaurant.pinyinNoDiacritics = this.restaurant.pinyin
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s/g, '');
  this.createdDate = Date.now();

  next();
});

module.exports = mongoose.model('Menu', menuSchema);
