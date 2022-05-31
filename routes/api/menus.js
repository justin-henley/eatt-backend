const express = require('express');
const router = express.Router();
const menusController = require('../../controllers/menusController');

router
  .route('/')
  .get(menusController.getAllMenus)
  .post(menusController.createNewMenu)
  .patch(menusController.updateMenu)
  .delete(menusController.deleteMenu);

router.route('/:id').get(menusController.getMenu);

module.exports = router;
