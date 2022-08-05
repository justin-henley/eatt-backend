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
  .route('/')
  .get(menusController.getAllMenus) // Anyone for now, but restrict if heavy usage and large database
  .post(verifyJWT, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), menusController.createNewMenu) // Editor or Admin
  .patch(verifyJWT, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), logChanges, menusController.updateMenu) // Editor or Admin
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), logChanges, menusController.deleteMenu); // Admin only

router.route('/:id').get(menusController.getMenu); // Anyone

module.exports = router;
