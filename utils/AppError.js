class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";

    //owner adding pizza without required fields is called an operational error
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
