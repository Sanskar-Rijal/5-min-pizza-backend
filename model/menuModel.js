const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A menu item must have a name"],
      unique: true,
      trim: true,
      minLength: [3, "Pizza name must have atleast 3 characters"],
    },
    unitPrice: {
      type: Number,
      required: [true, "A menu item must have a price"],
    },
    imageUrl: {
      type: String,
    },
    ingredients: {
      type: [String],
      required: [true, "A menu item must have ingredients"],
    },
    soldOut: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
