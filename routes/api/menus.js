const express = require('express');
const router = express.Router();
const menusController = require('../../controllers/menusController');
// Authentication
const verifyJWT = require('../../middleware/verifyJWT');

// Authentication required for post, patch, and delete
router
  .route('/')
  .get(menusController.getAllMenus)
  .post(verifyJWT, menusController.createNewMenu)
  .patch(verifyJWT, menusController.updateMenu)
  .delete(verifyJWT, menusController.deleteMenu);

router.route('/:id').get(menusController.getMenu);

module.exports = router;
