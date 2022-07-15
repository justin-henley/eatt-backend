// Models
const Restaurant = require('../model/Restaurant');

const getAllRestaurants = async (req, res) => {
  // Find all restaurants
  const restaurants = await Restaurant.find();
  // Report failure if none found
  if (!restaurants) return res.status(204).json({ message: 'No restaurants found.' });
  // Return all restaurants found
  res.json(restaurants);
};

const createNewRestaurant = async (req, res) => {
  // Check if required parameters were provided
  if (!req?.body?.zhtw || !req?.body?.address)
    return res.status(400).json({ message: 'ZHTW Name and address required.' });

  // Create the new restaurant and return
  try {
    const result = await Restaurant.create({
      zhtw: req.body.zhtw,
      taigi: req.body.taigi || '',
      en: req.body.en || '',
      address: req.body.address,
      phone: req.body.phone || '',
      url: req.body.url || '',
      gMaps: req.body.gMaps || '',
      menu: req.body.menu || null,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateRestaurant = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id) return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified dish
  const restaurant = await Restaurant.findOne({ _id: req.body.id }).exec();

  if (!restaurant) return res.status(204).json({ message: 'No restaurant matches ID' });

  // Update fields
  if (req.body?.zhtw) restaurant.zhtw = req.body.zhtw;
  if (req.body?.taigi) restaurant.taigi = req.body.taigi;
  if (req.body?.en) restaurant.en = req.body.en;
  if (req.body?.address) restaurant.address = req.body.address;
  if (req.body?.phone) restaurant.phone = req.body.phone;
  if (req.body?.url) restaurant.url = req.body.url;
  if (req.body?.gMaps) restaurant.gMaps = req.body.gMaps;
  if (req.body?.menu) restaurant.menu = req.body.menu;

  // Update the document
  const result = await restaurant.save();

  res.json(result);
};

const deleteRestaurant = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id) return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified restaurant
  const restaurant = await Restaurant.findOne({ _id: req.body.id }).exec();

  if (!restaurant) return res.status(204).json({ message: 'No restaurant matches ID' });

  // Delete the document
  const result = await restaurant.deleteOne({ _id: req.body.id });

  res.json(result);
};

const getRestaurant = async (req, res) => {
  // Check if an ID was provided
  if (!req?.params?.id) return res.status(400).json({ message: 'ID parameter required' });

  // Attempt to find specified restaurant
  const restaurant = await Restaurant.findOne({ _id: req.params.id }).exec();
  if (!restaurant) {
    return res.status(204).json({ message: `No restaurant matches ID ${req.params.id}` });
  }

  // Return the found restaurant
  res.json(restaurant);
};

module.exports = {
  getAllRestaurants,
  createNewRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurant,
};
