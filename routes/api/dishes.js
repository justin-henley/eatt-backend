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

// Authentication and authorization required for post, patch, and delete
router
  // TODO find a way to protect the get all route without breaking the search function
  .route('/')
  .get(dishesController.getAllDishes) // Anyone for now, but restrict if heavy usage and large database
  .post(verifyJWT, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), dishesController.createNewDish) // Editor or Admin
  .patch(verifyJWT, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), logChanges, dishesController.updateDish) // Editor or Admin
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), logChanges, dishesController.deleteDish); // Admin only

// Returns a single dish by id
router.route('/:id').get(dishesController.getDish); // Anyone

module.exports = router;
