// Libraries
const mongoose = require('mongoose');
// Models
const Changelog = require('../model/Changelog');

// Simplified Model
/* Changelog {
  user: String, required,
  timestamp: MongooseDate,
  entry: {
    id: ObjectID, required,
    ref: String, enum: ['Dish', 'Menu', 'Restaurant'],
  },
  data: [Object]
} 

*/

// Read one changlelog entry
const getChangelog = async (req, res) => {
  // Check if an ID was provided
  if (!req?.params?.id) return res.status(400).json({ message: 'ID parameter required' });

  // Cast ID to ObjectID type to check validity
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid Changelog ID' });

  // Attempt to find specified changelog
  const log = await Changelog.findById(req.params.id).exec();
  if (!log) {
    return res.status(204).json({ message: 'Changelog Not Found' });
  }

  // Return the found dish
  res.json(log);
};

// Read all changelogs or range
const getAllChangelogs = async (req, res) => {
  let logs;

  // Check for search parameters and query DB
  if (Object.keys(req?.query).length != 0) {
    // Searched based on url query
    logs = await searchChangelogs({ ...req.query });
  } else {
    // Retrieve all changelogs
    // TODO add limits to this?
    logs = await Changelog.find();
  }

  // Return data
  if (!logs) return res.status(204).json({ message: 'No changelogs found.' });
  res.json(logs);
};

/* 
Changelogs should be immutable. Any truly necessary changes can be made in the db
const updateChangelog = async (req, res) => {};
const deleteChangelog = async (req, res) => {}; */

// Search
const searchChangelogs = async (query) => {
  // Collect any search parameters provided
  // Allows for search by category, user, entryId
  // TODO allow search by timestamp range
  const searchParams = {};
  if (query.user) searchParams.user = query.user;
  if (query.ref) searchParams.ref = query.ref;
  if (query.entryId) searchParams.entryId = query.entryId;

  // Perform the search
  return await Changelog.find(searchParams);
};

// Exports do not include search function
module.exports = { getChangelog, getAllChangelogs };
