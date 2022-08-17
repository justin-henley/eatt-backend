// Libraries
const express = require('express');
const router = express.Router();
const menusController = require('../../controllers/menusController');

//MIDDLEWARE
// Authentication
const verifyJWT = require('../../middleware/verifyJWT');
// Authorization
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
// Logging
const logChanges = require('../../middleware/logChanges');

// Authentication and authorization required for post, patch, and delete
router
  // TODO find a way to protect the get all route without breaking the search function
  .route('/')
  .get(menusController.searchMenus) // Anyone for now, but restrict if heavy usage and large database
  .post(verifyJWT, /* verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), */ menusController.createNewMenu) // Editor or Admin
  .patch(verifyJWT, /* verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), */ logChanges, menusController.updateMenu) // Editor or Admin
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), logChanges, menusController.deleteMenu); // Admin only

// Get a single menu by ID
router.route('/:id').get(menusController.getMenu); // Anyone

// Retrieve all menus
router.route('/all').get(verifyJWT, verifyRoles(ROLES_LIST.Admin), menusController.getAllMenus);

module.exports = router;
