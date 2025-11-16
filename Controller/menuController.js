const Menu = require("../model/menuModel");
const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/AppError");

//add a new pizza to the menu
exports.newPizza = catchAsync(async (req, res, next) => {
  const newPizza = await Menu.create(req.body);
  res.status(201).json({
    status: "true",
    data: newPizza,
  });
});

//get all pizzas from the menu
exports.getAllPizzas = catchAsync(async (req, res, next) => {
  const pizzas = await Menu.find();
  res.status(200).json({
    status: "success",
    data: pizzas,
  });
});

//delete pizza from the menu by id
exports.deletePizza = catchAsync(async (req, res, next) => {
  const pizza = await Menu.findByIdAndDelete(req.params.id);

  if (!pizza) {
    return next(new AppError("No pizza found with that ID", 404));
  }

  res.status(204).json({
    status: "true",
    data: "Tour deleted successfully",
  });
});
