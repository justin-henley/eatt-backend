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

router
  // TODO allow users to edit their own menus, but only editor/admin to edit other users menus
  .route('/')
  .get(menusController.searchMenus) // Search for menus
  .post(verifyJWT, /* verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), */ menusController.createNewMenu) // Create a new menu
  .patch(verifyJWT, /* verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), */ logChanges, menusController.updateMenu) // Edit an existing menu
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), logChanges, menusController.deleteMenu); // Admin only

// Get a single menu by ID
router.route('/:id').get(menusController.getMenu); // Anyone

// Retrieve all menus
router.route('/all').get(verifyJWT, verifyRoles(ROLES_LIST.Admin), menusController.getAllMenus); // Admin only

module.exports = router;
