const express = require("express");

const morgan = require("morgan");

const AppError = require("./utils/AppError");

const menuRouter = require("./Routes/menuRoute");

const orderRouter = require("./Routes/orderRoutes");

const globalErrorHandler = require("./Controller/errorConroller");

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use((req, res, next) => {
    console.log("Hello from the middleware");
    next();
  });
}

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/order", orderRouter);

//if no route is found
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//making error handling middleware which can be used anywhere in the app
app.use(globalErrorHandler);

module.exports = app;
