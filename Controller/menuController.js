const Menu = require("../model/menuModel");

exports.newPizza = async (req, res) => {
  const newPizza = await Menu.create(req.body);
  res.status(201).json({
    status: "true",
    data: newPizza,
  });
};
