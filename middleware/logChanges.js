// Models
const Changelog = require('../model/Changelog');

// Log any changes to documents in the DB
const logChanges = async (req, res, next) => {
  // Check that all required parameters are provided
  if (!req?.user || !req?.body?.id) {
    return res.status(400).json({ message: 'Username, entry ID, and data fields required to generate changelog.' });
  }

  // Decipher ref from request
  let ref =
    req.baseUrl === '/dishes'
      ? 'Dish'
      : req.baseUrl === '/menus'
      ? 'Menu'
      : req.baseUrl === '/restaurants'
      ? 'Restaurant'
      : 'None';

  // Create the new log entry and return success
  try {
    const result = await Changelog.create({
      user: req.user,
      entry: {
        id: req.body.id,
        ref: ref,
      },
      data: req.body,
    });

    next();
  } catch (error) {
    // Catch any errors and return failure to prevent the operation that generated the changelog
    res.status(500).json({ message: 'An unknown error occured during changelog creation.' });
  }
};
module.exports = logChanges;
