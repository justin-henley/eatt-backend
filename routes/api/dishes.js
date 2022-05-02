const express = require('express');
const router = express.Router();
const dishesController = require('../../controllers/dishesController');

router
  .route('/')
  .get(dishesController.getAllDishes)
  .post(dishesController.createNewDish)
  .patch(dishesController.updateDish)
  .delete(dishesController.deleteDish);

// TODO this doesn't work, everything ends up at getAll above
router.route('/:id').get(dishesController.getDish);

module.exports = router;
