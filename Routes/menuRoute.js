const express = require("express");

const router = express.Router();

const menuController = require("../Controller/menuController");

//to add a new pizza on menu
router
  .route("/")
  .get(menuController.getAllPizzas)
  .post(menuController.newPizza);

router.route("/:id").delete(menuController.deletePizza);

module.exports = router;
