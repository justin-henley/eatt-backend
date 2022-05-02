const Menu = require('../model/Menu');

const getAllMenus = async (req, res) => {
  const menus = await Menu.find();

  if (!menus) return res.status(204).json({ message: 'No menus found.' });
  res.json(menus);
};

const createNewMenu = async (req, res) => {
  if (!req?.body?.zhtw)
    return res.status(400).json({ message: 'ZHTW Name required.' });

  try {
    const result = await Menu.create({
      zhtw: req.body.zhtw,
      taigi: req.body.taigi || '',
      en: req.body.en || '',
      menu: req.body.menu || [],
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateMenu = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id)
    return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified menu
  const menu = await Menu.findOne({ _id: req.body.id }).exec();

  if (!menu) return res.status(204).json({ message: 'No menu matches ID' });

  // Update fields
  if (req.body?.zhtw) menu.zhtw = req.body.zhtw;
  if (req.body?.taigi) menu.taigi = req.body.taigi;
  if (req.body?.en) menu.en = req.body.en;
  if (req.body?.menu) menu.menu = req.body.menu;

  // Update the document
  const result = await menu.save();

  res.json(result);
};

const deleteMenu = async (req, res) => {
  // Check if an ID was provided
  if (!req?.body?.id)
    return res.status(400).json({ message: 'ID parameter required.' });

  // Attempt to find the specified menu
  const menu = await Menu.findOne({ _id: req.body.id }).exec();

  if (!menu) return res.status(204).json({ message: 'No menu matches ID' });

  // Delete the document
  const result = await menu.deleteOne({ _id: req.body.id });

  res.json(result);
};

const getMenu = async (req, res) => {
  // Check if an ID was provided
  if (!req?.params?.id)
    return res.status(400).json({ message: 'ID parameter required' });

  // Attempt to find the specified menu
  const menu = await Menu.findOne({ _id: req.params.id }).exec();

  if (!menu) {
    return res
      .status(204)
      .json({ message: `No menu matches ID ${req.params.id}` });
  }

  // Return the found menu
  res.json(menu);
};

module.exports = {
  getAllMenus,
  createNewMenu,
  updateMenu,
  deleteMenu,
  getMenu,
};
