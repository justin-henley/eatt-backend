// Libraries
const mongoose = require('mongoose');
// Models
const Changelog = require('../model/Changelog');

// Simplified Model
// TODO add once stable

// TODO Create
const createChangelog = async (req, res) => {
  // Check that all required parameters are provided
  // Create the new log entry and return success
  // Catch any errors and return failure to prevent the operation that generated the changelog
  // TODO failure should halt the change
};

// TODO Read One
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

// TODO Read all or range
const getAllChangelogs = async (req, res) => {
  // Check for search parameters
  // Query data
  // Return data
};

// TODO Update

// TODO Delete
