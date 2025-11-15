const Menu = require("../model/menuModel");
const catchAsync = require("../utils/catchAsync");

//add a new pizza to the menu
exports.newPizza = catchAsync(async (req, res) => {
  const newPizza = await Menu.create(req.body);
  res.status(201).json({
    status: "true",
    data: newPizza,
  });
});

//get all pizzas from the menu
exports.getAllPizzas = catchAsync(async (req, res) => {
  const pizzas = await Menu.find();
  res.status(200).json({
    status: "success",
    data: pizzas,
  });
});

//delete pizza from the menu by id
exports.deletePizza = catchAsync(async (req, res) => {
  const pizza = await Menu.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "true",
    data: "Tour deleted successfully",
  });
});
