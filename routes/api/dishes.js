// Libraries
const express = require('express');
const router = express.Router();
const dishesController = require('../../controllers/dishesController');

// MIDDLEWARE
// Authentication
const verifyJWT = require('../../middleware/verifyJWT');
// Authorization
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
// Logging
const logChanges = require('../../middleware/logChanges');

router
  // TODO allow users to edit their own dishes, but only editor/admin to edit other users dishes
  .route('/')
  .get(dishesController.searchDishes) // Search for dishes
  .post(verifyJWT, /* verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), */ dishesController.createNewDish) // Create a new dish
  .patch(verifyJWT, /* verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),*/ logChanges, dishesController.updateDish) // Edit an existing dish
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), logChanges, dishesController.deleteDish); // Admin only

// Retrieve all dishes
router.route('/all').get(verifyJWT, verifyRoles(ROLES_LIST.Admin), dishesController.getAllDishes); // Admin only

// Returns a single dish by id
router.route('/:id').get(dishesController.getDish); // Anyone

module.exports = router;
