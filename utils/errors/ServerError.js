const { SERVER_ERROR, DEFAULT_ERROR_MESSAGES } = require('../constants');

module.exports = (error, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = error;
  res.status(statusCode).send({
    message: statusCode === 500 ? DEFAULT_ERROR_MESSAGES.SERVER_ERROR : message,
  });
  next();
};
