// Libraries
const mongoose = require('mongoose');
const { sendStatus } = require('express/lib/response');
// Models
const Changelog = require('../model/Changelog');
// TODO test and verify

// Log any changes to documents in the DB
const logChanges = async (req, res, next) => {
  // Check that all required parameters are provided
  if (!req?.user || !req?.body?.id || !req?.body?.data) return res.sendStatus(400);
  /* .json({ message: 'Username, entry ID, ref, and data fields required to generate changelog.' }); */

  // TODO decipher ref from request
  let ref;

  // Create the new log entry and return success
  try {
    const result = await Changelog.create({
      user: req.user,
      entryId: req.body.id,
      ref: ref,
      data: req.body,
    });

    next();
  } catch (error) {
    // Catch any errors and return failure to prevent the operation that generated the changelog
    res.sendStatus(500); /* .json({ message: 'An unknown error occured during changelog creation.' }); */
  }
};
module.exports = logChanges;
