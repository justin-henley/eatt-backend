// Libraries
const express = require('express');
const router = express.Router();
const accountController = require('../../controllers/accountController');

// Middleware
// Authentication required, but not authorization
const verifyJWT = require('../../middleware/verifyJWT');

// Authentication required for all routes
router.route('/dishes').get(verifyJWT, accountController.getUserDishes);
router.route('/menus').get(verifyJWT, accountController.getUserMenus);
