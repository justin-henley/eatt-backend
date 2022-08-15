// Libraries
const mongoose = require('mongoose');
// Models
const Dish = require('../model/Dish');
const Menu = require('../model/Menu');

// Get all dishes for the logged in user account. Requires auth context
const getUserDishes = async (req, res) => {
  // Username is stored in req.username by verifyJWT middleware

  // Get all dishes by the user
  // TODO is that search query correct?
  console.log(req.user);
  const dishes = await Dish.find({ 'history.creator': req.user }).exec();

  // No data found
  if (!dishes) {
    return res.status(204).json({ message: "You haven't created any dishes yet." });
  }

  // Return data as json
  res.json(dishes);
};

// Get all menus for the logged in user
const getUserMenus = async (req, res) => {
  // Username is stored in req.username by verifyJWT middleware

  // Get all menus by the user
  // TODO validate this search
  const menus = await Menu.find({ history: { creator: req.user } }).exec();

  // No data found
  if (!menus) {
    return res.status(204).json({ message: "You haven't created any menus yet." });
  }

  // Return data as json
  res.json(menus);
};

module.exports = { getUserDishes, getUserMenus };
