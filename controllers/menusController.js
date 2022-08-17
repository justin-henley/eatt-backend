// Libraries
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
// Models
const Menu = require('../model/Menu');

// Simplified model
/* Menu {
  history: {
    creator: String,
    createdDate: Date,
  },
  restaurant: {
    zhtw: String,
    pinyin: String,
    en: String,
    pinyinNoDiacritics: String,
  },
  menu: [
    {
      zhtw: String,
      pinyin: String,
      en: String,
      items: [{ type: ObjectID, ref: 'Dish' }],
    },
  ],
}; */

const getAllMenus = async (req, res) => {
  // Return all dishes
  const menus = await Menu.find({}, '-menu').populate('menu.items');

  // Return results
  if (!menus) return res.status(204).json({ message: 'No menus found.' });
  res.json(menus);
};

const createNewMenu = async (req, res) => {
  // Checking for all required fields
  if (!req?.body?.restaurant?.zhtw) return res.status(400).json({ message: 'ZHTW Name required.' });
  if (!req?.body?.restaurant?.pinyin) return res.status(400).json({ message: 'Pinyin Name required.' });
  if (!req?.body?.restaurant?.en) return res.status(400).json({ message: 'English Name required.' });
  if (req?.body?.restaurant?.pinyinNoDiacritics)
    return res.status(400).json({ message: 'pinyinNoDiacritics should not be set manually.' });

  try {
    const result = await Menu.create({
      history: {
        creator: req.user,
      },
      restaurant: {
        zhtw: req.body.restaurant.zhtw,
        pinyin: req.body.restaurant.pinyin || '',
        en: req.body.restaurant.en || '',
      },
      menu: req.body.menu || [],
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

// Menu.findOneAndUpdate is possible, but this version allows for full validation and control
const updateMenu = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id) return res.status(400).json({ message: 'ID parameter required.' });

  try {
    // Attempt to find the specified menu
    const menu = await Menu.findById(req.body.id).exec();

    if (!menu) return res.status(204).json({ message: 'Menu Not Found.' });

    // Update fields
    menu.restaurant = { ...req.body.restaurant };
    menu.menu = [...req.body.menu];

    // Update the document
    const result = await menu.save();

    res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'An unknown error occurred.' });
  }
};

const deleteMenu = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id) return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified menu
  const menu = await Menu.findById(req.body.id).exec();

  if (!menu) return res.status(204).json({ message: 'Menu Not Found.' });

  // Delete the document
  const result = await menu.deleteOne({ _id: req.body.id });

  res.json(result);
};

const getMenu = async (req, res) => {
  // Check if an ID was provided
  if (!req?.params?.id) return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to cast specified id to ObjectID to check validity
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid Menu ID.' });

  // Attempt to find the specified menu
  const menu = await Menu.findById(req.params.id).populate('menu.items').exec();

  // Menu not found
  if (!menu) {
    return res.status(204).json({ message: `Menu Not Found.` });
  }

  // Return the found menu
  res.json(menu);
};

const searchMenus = async (req, res) => {
  // Check for a search query
  if (Object.keys(req?.query).length === 0) {
    // Return early if no search parameters were provided
    return res.status(400).json({ message: 'Please provide a search parameter.' });
  }

  // Check to see what valid search parameters were provided
  const params = req.query;
  const searchParams = {};

  // TODO explore MongoDB full-text search indexes for better search results

  if (params.zhtw) searchParams['restaurant.zhtw'] = { $regex: params.zhtw };
  if (params.en) searchParams['restaurant.en'] = { $regex: params.en, $options: 'i' };

  // Search with diacritics for precise searching
  if (params.pinyin)
    searchParams['restaurant.pinyin'] = {
      $regex: params.pinyin,
      $options: 'i',
    };
  // Search without diacritics for simpler searching
  if (params.pinyinNoDiacritics)
    searchParams['restaurant.pinyinNoDiacritics'] = {
      $regex: params.pinyinNoDiacritics.replace(/\s/g, ''),
      $options: 'i',
    };

  // Check that at least one valid search paramter was found
  if (searchParams === {}) {
    return res.status(400).json({ message: 'Please provide a valid search parameter.' });
  }

  // Perform the search with the given parameters and return the result
  const results = await Menu.find(searchParams, '-menu');
  if (!results) return res.status(204).json({ message: 'No menus found.' });
  res.json(results);
};

module.exports = {
  getAllMenus,
  createNewMenu,
  updateMenu,
  deleteMenu,
  getMenu,
  searchMenus,
};
