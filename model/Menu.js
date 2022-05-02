const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectID } = Schema.Types;

const menuSchema = new Schema({
  zhtw: String,
  taigi: String,
  en: String,
  menu: [
    {
      type: ObjectID,
      ref: 'dishes',
    },
  ],
});

module.exports = mongoose.model('Menu', menuSchema);
