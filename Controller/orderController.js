const Order = require("../model/orderModel");

const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/AppError");

//create a new order
exports.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = await Order.create(req.body);

  //populating pizza names with the id
  await newOrder.populate("cart.pizzaId", "name");

  res.status(201).json({
    status: "success",
    data: newOrder,
  });
});

//search order by id
exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ orderId: req.params.id });

  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

//user can make order priority even if the order was made
exports.updateOrderPriority = catchAsync(async (req, res, next) => {
  // const updateOrder = await Order.findOneAndUpdate(
  //   { orderId: req.params.id },
  //   { priority: req.body.priority },
  //   { new: true }
  // );
  const updateOrder = await Order.findOne({ orderId: req.params.id });
  await updateOrder.setPriorityPrice(req.body.priority);

  if (!updateOrder) {
    return next(new AppError("No order found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updateOrder,
  });
});
