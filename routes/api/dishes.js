const express = require('express');
const router = express.Router();
const dishesController = require('../../controllers/dishesController');
// Authentication
const verifyJWT = require('../../middleware/verifyJWT');
// Authorization
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

// Authentication and authorization required for post, patch, and delete
router
  .route('/')
  .get(dishesController.getAllDishes) // Anyone for now, but restrict if heavy usage and large database
  .post(/* verifyJWT, */ /* verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), */ dishesController.createNewDish) // Editor or Admin
  .patch(verifyJWT, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), dishesController.updateDish) // Editor or Admin
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), dishesController.deleteDish); // Admin only

// Returns a single dish by id
router.route('/:id').get(dishesController.getDish); // Anyone

module.exports = router;
