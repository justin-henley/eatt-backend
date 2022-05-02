const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectID } = Schema.Types;

const restaurantSchema = new Schema({
  zhtw: String,
  taigi: String,
  en: String,
  address: String,
  phone: String,
  url: String,
  gMaps: String,
  menu: {
    type: ObjectID,
    ref: 'menus',
  },
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
