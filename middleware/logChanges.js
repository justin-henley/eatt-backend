// Libraries
const mongoose = require('mongoose');
const { sendStatus } = require('express/lib/response');
// Models
const Changelog = require('../model/Changelog');
// TODO test and verify

// Log any changes to documents in the DB
const logChanges = async (req, res, next) => {
  // Check that all required parameters are provided
  if (!req?.body?.user || !req?.body?.entryId || !req?.body?.ref || !req?.body?.data) return res.sendStatus(400);
  /* .json({ message: 'Username, entry ID, ref, and data fields required to generate changelog.' }); */

  // Create the new log entry and return success
  try {
    const result = await Changelog.create({
      user: req.body.user,
      entryId: req.body.entryId,
      ref: req.body.ref,
      data: req.body.data,
    });

    next();
  } catch (error) {
    // Catch any errors and return failure to prevent the operation that generated the changelog
    res.sendStatus(500); /* .json({ message: 'An unknown error occured during changelog creation.' }); */
  }
};
module.exports = logChanges;
