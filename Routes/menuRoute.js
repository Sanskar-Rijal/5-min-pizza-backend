const express = require("express");

const router = express.Router();

const menuController = require("../Controller/menuController");

//to add a new pizza on menu
router.route("/newPizza").post(menuController.newPizza);

module.exports = router;
