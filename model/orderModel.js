const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: [true, "Order must have a customer name"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Order must have a customer phone number"],
    },
    address: {
      type: String,
      required: [true, "Order must have a delivery address"],
    },
    cart: [
      {
        pizzaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be atleast 1"],
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    position: {
      type: String,
      default: "",
    },
    priority: {
      type: Boolean,
      default: false,
    },
    // status: {
    //   type: String,
    //   defualt: "preparing",
    //   enum: {
    //     values: ["preparing", "delivered"],
    //     message: "Status is either: preparing, delivered",
    //   },
    // },
    estimatedDelivery: {
      type: Date,
    },
    orderPrice: {
      type: Number,
    },
    priorityPrice: {
      type: Number,
    }, //order status i.e tracking id
    orderId: {
      type: String,
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//using  document middleware
orderSchema.pre("save", function (next) {
  //we will set estimated Delivery based on priority
  //we will set estimated delivery only if order is new
  if (this.isNew) {
    const now = Date.now();
    if (this.priority) {
      this.estimatedDelivery = new Date(now + 30 * 60 * 1000); //30 minutes from now
    } else {
      this.estimatedDelivery = new Date(now + 60 * 60 * 1000); //60 minutes from now
    }
  }
  next();
});

//gettting pizza name from menuModel
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cart.pizzaId",
    select: "name",
  });
  next();
});

//middleware to calculate price of each cart item
orderSchema.pre("save", function (next) {
  this.orderPrice = this.cart.reduce(
    (accumulator, pizza) => accumulator + pizza.totalPrice,
    0
  );
  //if the field is set to priority
  this.priorityPrice = this.priority ? this.orderPrice * 0.2 : 0;
  next();
});

//creating instance method, so when user set priority to true we can update price too
orderSchema.methods.setPriorityPrice = async function (priority) {
  this.priority = priority;
  await this.save(); //since it's being saved so above middle ware will be called to calculate price
};
//middleware to generate unique tracking id for each order
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    let unique = false;
    while (!unique) {
      //generating 4 digit random number
      const id = Math.floor(1000 + Math.random() * 9000).toString();

      //checking if the id already is in the database
      /* eslint-disable no-await-in-loop */
      const exists = await this.constructor.findOne({ orderId: id }); //this.constructor refers to the model i mean Order
      /* eslint-enable no-await-in-loop */
      if (!exists) {
        this.orderId = id;
        unique = true;
      }
    }
  }
});

//using virtual property to set status of order
//virtual propery are not stored in database, they are sent to user
orderSchema.virtual("status").get(function () {
  if (!this.estimatedDelivery) return "PREPARING ORDER";

  return Date.now() >= this.estimatedDelivery ? "DELIVERED" : "PREPARING ORDER";
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
