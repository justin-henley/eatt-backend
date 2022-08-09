const express = require('express');
const router = express.Router();
const resetController = require('../../controllers/resetController');

router.post('/', resetController.generateReset);
router.post('/:resetToken', resetController.handleReset);

module.exports = router;
