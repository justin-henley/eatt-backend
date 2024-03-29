const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');

router.post('/', registerController.handleNewUser);
router.get('/:confirmationCode', registerController.verifyUser);

module.exports = router;
