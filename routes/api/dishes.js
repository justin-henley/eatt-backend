const express = require('express');
const router = express.Router();
const dishesController = require('../../controllers/dishesController');

router
  .route('/')
  .get(dishesController.getAllDishes)
  .post(dishesController.createNewDish)
  .put(dishesController.updateDish)
  .delete(dishesController.deleteDish);

router.route('/:id').get(dishesController.getDish);

module.exports = router;
