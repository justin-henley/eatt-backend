// Libraries
const express = require('express');
const router = express.Router();
// Controller
const changelogsController = require('../../controllers/changelogsController');
// Authentication
const verifyJWT = require('../../middleware/verifyJWT');
// Authorization
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// Other routes likely shouldn't be exposed. Create should only be internal to this backend, not exposed in the API. Changelogs should be immutable.

// Authentication and authorization required for all paths
router
  .route('/')
  .get(verifyJWT, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), changelogsController.getAllChangelogs); // Get all changelogs

// Returns a single changelog by id
router
  .route('/:id')
  .get(verifyJWT, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), changelogsController.getChangelog);

module.exports = router;
