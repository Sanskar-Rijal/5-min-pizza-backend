//our global error handler middleware
//if we write next(err) then this will run skipping all other middlewares in between

const AppError = require("../utils/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`; //path is basically the id and value is the user input
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value : ${err.keyValue.name}. Please use another value!!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((element) => element.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    data: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operational, trusted error :send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      data: err.message,
    });
  } else {
    //programming or other unknown error : don't leak error details
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      data: "Something went very very very wrong!!!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    error.stack = err.stack;

    //handle specific errors here

    //error no 1, cast error, occured when id is not matched
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }

    //error no 2, duplicate field error, if a field is unique and user tries to enter same value
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    //error no 3 , validation error, if user enters soemthing that doesn't match the schema
    //example length of pizza should be greater than 3
    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
  }
};

module.exports = globalErrorHandler;
