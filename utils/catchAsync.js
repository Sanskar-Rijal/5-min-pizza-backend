const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    //fn is async function so it returns a promise, to catch a promise we use .catch
    next(err);
  });
};

module.exports = catchAsync;
