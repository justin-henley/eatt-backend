const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, ObjectID, MongooseDate = Date } = Schema.Types;

const changelogSchema = new Schema({
  user: {
    type: String,
    required: true,
  }, // user making changes
  timestamp: {
    type: MongooseDate,
  }, // timestamp of change from backend
  entryId: {
    type: ObjectID,
    required: true,
  }, // id of the item changed
  // TODO Cannot find a way to populate this dynamically like in Menu. The ref must be a string in the schema.
  ref: {
    type: String,
    enum: ['Dish', 'Menu', 'Restaurant'],
  }, // The collection the item is from
  data: {
    //what datatype to put here?
  }, // the request body
});

// Set the timestamp
changelogSchema.pre('save', function (next) {
  this.timestamp = Date.now();

  next();
});

module.exports = mongoose.model('Changelog', changelogSchema);
