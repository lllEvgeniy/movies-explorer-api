const {
  ERROR_MESSAGE, SERVER_ERROR,
} = require('../utils/constants');

module.exports = ((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR
        ? ERROR_MESSAGE.INTERNAL_SERVER_ERROR
        : message,
    });
  next();
});
