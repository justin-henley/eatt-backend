const express = require('express');
const router = express.Router();
const restaurantsController = require('../../controllers/restaurantsController');

router
  .route('/')
  .get(restaurantsController.getAllRestaurants)
  .post(restaurantsController.createNewRestaurant)
  .put(restaurantsController.updateRestaurant)
  .delete(restaurantsController.deleteRestaurant);

router.route('/:id').get(restaurantsController.getRestaurant);

module.exports = router;
