// Libraries
const mongoose = require('mongoose');
// Models
const Dish = require('../model/Dish');

const getAllDishes = async (req, res) => {
  let dishes;

  // Check for a search query
  if (Object.keys(req?.query).length !== 0) {
    // Search based on url query
    dishes = await searchDishes({ ...req.query });
  } else {
    // Return all dishes
    dishes = await Dish.find();
  }

  if (!dishes) return res.status(204).json({ message: 'No dishes found.' });
  res.json(dishes);
};

const createNewDish = async (req, res) => {
  // Check if required parameters were provided
  if (
    !req?.body?.zhtw ||
    !req?.body?.pinyin /* ||
    !req?.body?.meat ||
    !req?.body?.category */
  )
    return res.status(400).json({ message: 'ZHTW Name, meat type, and category required.' });

  // Create the new dish and return
  try {
    const result = await Dish.create({
      zhtw: req.body.zhtw,
      pinyin: req.body.pinyin,
      meat: req.body.meat,
      category: req.body.category,
      taigi: req.body.taigi || null,
      en: req.body.en || null,
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        message: `Error: ${error.keyValue.zhtw} already exists in database. Please do not duplicate entries.`,
      });
    } else {
      res.status(500).json({ message: `An unknown error occurred.` });
    }
  }
};

const updateDish = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id) return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified dish
  const dish = await Dish.findOne({ _id: req.body.id }).exec();

  if (!dish) return res.status(204).json({ message: 'No dish matches ID' });

  // Update fields
  if (req.body?.zhtw) dish.zhtw = req.body.zhtw;
  if (req.body?.pinyin) dish.pinyin = req.body.pinyin;
  if (req.body?.meat) dish.meat = req.body.meat;
  if (req.body?.category) dish.category = req.body.category;
  if (req.body?.taigi) dish.taigi = req.body.taigi;
  if (req.body?.en) dish.en = req.body.en;

  // Update the document
  const result = await dish.save();

  res.json(result);
};

const deleteDish = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id) return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified dish
  const dish = await Dish.findOne({ _id: req.body.id }).exec();

  if (!dish) return res.status(204).json({ message: 'No dish matches ID' });

  // Delete the document
  const result = await dish.deleteOne({ _id: req.body.id });

  res.json(result);
};

const getDish = async (req, res) => {
  // Check if an ID was provided
  if (!req?.params?.id) return res.status(400).json({ message: 'ID parameter required' });

  // Attempt to cast specified id to ObjectID to check validity
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid Dish ID' });

  // Attempt to find specified dish
  const dish = await Dish.findOne({ _id: req.params.id }).exec();
  if (!dish) {
    return res.status(204).json({ message: `Dish Not Found.` });
  }

  // Return the found dish
  res.json(dish);
};

const searchDishes = async (params) => {
  // Check to see what valid search parameters were provided
  const searchParams = {};

  // TODO explore MongoDB full-text search indexes for better search results

  if (params.zhtw) searchParams.zhtw = { $regex: params.zhtw };
  if (params.en) searchParams.en = { $regex: params.en, $options: 'i' };
  if (params.category) searchParams.category = params.category;
  if (params.meat) searchParams.meat = params.meat;
  if (params.taigi) searchParams.taigi = params.taigi; // This should be expanded to ignore accent marks if used. See pinyin below
  // Search with diacritics for precise searching
  if (params.pinyin) searchParams.pinyin = { $regex: params.pinyin, $options: 'i' };
  // Search without diacritics for simpler searching
  if (params.pinyinNoDiacritics)
    searchParams.pinyinNoDiacritics = {
      $regex: params.pinyinNoDiacritics.replace(/\s/g, ''),
      $options: 'i',
    };
  // Perform the search with the given parameters and return the result
  return await Dish.find(searchParams);
};

module.exports = {
  getAllDishes,
  createNewDish,
  updateDish,
  deleteDish,
  getDish,
};
