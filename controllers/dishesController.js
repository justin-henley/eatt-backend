const Dish = require('../model/Dish');

const getAllDishes = async (req, res) => {
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
    return res
      .status(400)
      .json({ message: 'ZHTW Name, meat type, and category required.' });

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
    console.error(error);
  }
};

const updateDish = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id)
    return res.status(400).json({ message: 'ID parameter required.' });

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
  if (!req?.body?.id)
    return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified dish
  const dish = await Dish.findOne({ _id: req.body.id }).exec();

  if (!dish) return res.status(204).json({ message: 'No dish matches ID' });

  // Delete the document
  const result = await dish.deleteOne({ _id: req.body.id });

  res.json(result);
};

const getDish = async (req, res) => {
  // Check if an ID was provided
  if (!req?.params?.id)
    return res.status(400).json({ message: 'ID parameter required' });

  // Attempt to find specified dish
  const dish = await Dish.findOne({ _id: req.params.id }).exec();
  if (!dish) {
    return res
      .status(204)
      .json({ message: `No dish matches ID ${req.params.id}` });
  }

  // Return the found dish
  res.json(dish);
};

module.exports = {
  getAllDishes,
  createNewDish,
  updateDish,
  deleteDish,
  getDish,
};
