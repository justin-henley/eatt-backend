const express = require('express');
const router = express.Router();
const dishesController = require('../../controllers/dishesController');
// Authentication
const verifyJWT = require('../../middleware/verifyJWT');

// Authentication required for post, patch, and delete
router
  .route('/')
  .get(dishesController.getAllDishes)
  .post(verifyJWT, dishesController.createNewDish)
  .patch(verifyJWT, dishesController.updateDish)
  .delete(verifyJWT, dishesController.deleteDish);

// Returns a single dish by id
router.route('/:id').get(dishesController.getDish);

module.exports = router;
