const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectID, String, MongooseDate = Date } = Schema.Types;

const menuSchema = new Schema({
  history: {
    creator: {
      type: String,
      required: true,
    },
    createdDate: {
      type: MongooseDate,
    },
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
    // This should NOT be a virtual property, because virtuals are not stored and thus not searchable
    pinyinNoDiacritics: {
      type: String,
      default: '',
    },
  },
  // Menu is divided into named sections. Sections should be labelled with zhtw, en, and pinyin. No need to strip pinyin for searching
  menu: [
    {
      categoryId: { type: Number, required: true },
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
  this.history.createdDate = Date.now();

  next();
});

module.exports = mongoose.model('Menu', menuSchema);
