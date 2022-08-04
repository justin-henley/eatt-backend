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
    changelog: [
      {
        user: String,
        data: String,
        timestamp: Date,
      },
    ],
  },
  restaurant: {
    zhtw: String,
    pinyin: String,
    en: String,
    // TODO pinyinNoDiacritics should be a virtual property!
    pinyinNoDiacritics: VIRTUAL PROPERTY,
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

// TODO add a way to delete a single dish from a menu
// TODO add a way to update a menu that adds the given dishes WITHOUT erasing those already stored

const getAllMenus = async (req, res) => {
  let menus;

  // Check for a search query
  if (Object.keys(req?.query).length !== 0) {
    // Search based on url query
    menus = await searchMenus({ ...req.query });
  } else {
    // Return all dishes
    menus = await Menu.find({}, '-menu').populate('menu.items');
  }

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
        changelog: [],
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

// TODO add history to update route
const updateMenu = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id) return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified menu
  const menu = await Menu.findOne({ _id: req.body.id }).exec();

  if (!menu) return res.status(204).json({ message: 'Menu Not Found.' });

  // Update fields
  // TODO there should be a way to iterate through and check values. Get the prop name and value. You've done that elsewhere in this app
  if (req.body?.restaurant?.zhtw) menu.zhtw = req.body.zhtw;
  if (req.body?.taigi) menu.taigi = req.body.taigi;
  if (req.body?.en) menu.en = req.body.en;
  if (req.body?.menu) menu.menu = req.body.menu;

  // TODO I think changelog should be a separate collection to keep these entries lighter?
  // Add entry history
  menu.history.changelog = [...menu.history.changelog, { user: req.user, data: req.body, timestamp: Date.now() }];

  // Update the document
  const result = await menu.save();

  res.json(result);
};

// TODO log all delete operations in a separate collection. Include full item data, plus user and timestamp. Ensure nothing can be permanently deleted thru api
const deleteMenu = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id) return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified menu
  const menu = await Menu.findOne({ _id: req.body.id }).exec();

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
  const menu = await Menu.findOne({ _id: req.params.id }).populate('menu.items').exec();

  // Menu not found
  if (!menu) {
    return res.status(204).json({ message: `Menu Not Found.` });
  }

  // Return the found menu
  res.json(menu);
};

const searchMenus = async (params) => {
  // Check to see what valid search parameters were provided
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

  // Perform the search with the given parameters and return the result
  return await Menu.find(searchParams, '-menu');
};

module.exports = {
  getAllMenus,
  createNewMenu,
  updateMenu,
  deleteMenu,
  getMenu,
};
