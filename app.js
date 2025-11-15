const express = require("express");

const morgan = require("morgan");

const menuRouter = require("./Routes/menuRoute");

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

module.exports = app;
