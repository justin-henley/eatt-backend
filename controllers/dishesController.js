// Libraries
const mongoose = require('mongoose');
// Models
const Dish = require('../model/Dish');

// Simplified model
/* Dish {
  zhtw: String,
  pinyin: String,
  meat: enum: ['beef', 'pork', 'bird', 'fish', 'veg', 'egg', 'unknown', 'other', null],
  category: enum: ['rice', 'noodle', 'bread', 'soup', 'drink', 'unknown', 'other', null],
  taigi: String,
  en: String,
  pinyinNoDiacritics: String,
  history: {
    creator: String,
    createdDate: Date,
  },
}; */

const getAllDishes = async (req, res) => {
  // Return all dishes
  const dishes = await Dish.find();

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
    // Create the dish
    const result = await Dish.create({
      zhtw: req.body.zhtw,
      pinyin: req.body.pinyin,
      meat: req.body.meat,
      category: req.body.category,
      taigi: req.body.taigi || null,
      en: req.body.en || null,
      history: {
        creator: req.user,
      },
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

  try {
    // Attempt to find the specified dish
    const dish = await Dish.findById(req.body.id).exec();

    if (!dish) return res.status(204).json({ message: 'No dish matches ID' });

    // Update fields
    // Fields are explicitly listed to limit search queries to these properties
    if (req.body?.zhtw) dish.zhtw = req.body.zhtw;
    if (req.body?.pinyin) dish.pinyin = req.body.pinyin;
    if (req.body?.meat) dish.meat = req.body.meat;
    if (req.body?.category) dish.category = req.body.category;
    if (req.body?.taigi) dish.taigi = req.body.taigi;
    if (req.body?.en) dish.en = req.body.en;

    // Update the document
    const result = await dish.save();

    res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'An unknown error occurred' });
  }
};

const deleteDish = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id) return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified dish
  const dish = await Dish.findById(req.body.id).exec();

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
  const dish = await Dish.findById(req.params.id).exec();
  if (!dish) {
    return res.status(204).json({ message: `Dish Not Found.` });
  }

  // Return the found dish
  res.json(dish);
};

const searchDishes = async (req, res) => {
  // Check for a search query
  if (Object.keys(req?.query).length === 0) {
    // Return early if no search parameters were provided
    return res.status(400).json({ message: 'Please provide a search parameter.' });
  }

  // Check to see what valid search parameters were provided
  const params = req.query;

  const searchParams = {};

  // TODO explore MongoDB full-text search indexes for better search results
  // TODO Server crashes if a single '?' is passed as search term for zhtw, en, or pinyins. Regex issue.
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

  // Check that at least one valid search parameter was found
  if (searchParams === {}) {
    return res.status(400).json({ message: 'Please provide a valid search parameter.' });
  }

  // Perform the search with the given parameters and return the result
  const dishes = await Dish.find(searchParams);
  if (!dishes) return res.status(204).json({ message: 'No dishes found.' });

  // Return json or html
  if (req.accepts('html')) {
    res.render('dishes', { title: 'Dishes', dishes: dishes });
  } else {
    res.json(dishes);
  }
};

module.exports = {
  getAllDishes,
  createNewDish,
  updateDish,
  deleteDish,
  getDish,
  searchDishes,
};
