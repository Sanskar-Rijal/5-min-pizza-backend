const express = require("express");

const router = express.Router();

const orderController = require("../Controller/orderController");

//to place a new order
router.route("/").post(orderController.createOrder);

//find order by id
router
  .route("/:id")
  .get(orderController.getOrderById)
  .patch(orderController.updateOrderPriority);

module.exports = router;
