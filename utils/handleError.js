const mongoose = require('mongoose');
const { DEFAULT_ERROR_MESSAGES } = require('./constants');

const BadRequestError = require('./errors/BadRequestError');
const NotFoundError = require('./errors/NotFoundError');
const ConflictError = require('./errors/ConflictError');
const ServerError = require('./errors/ServerError');

const handleError = (err, next) => {
  if (
    err instanceof mongoose.Error.CastError
    || err instanceof mongoose.Error.ValidationError
  ) {
    next(new BadRequestError());
    return;
  }
  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    next(new NotFoundError(DEFAULT_ERROR_MESSAGES.ITEM_NOT_FOUND));
    return;
  }
  if (err.name === 'MongoServerError') {
    if (err.code === 11000) { next(new ConflictError()); } else { next(new ServerError()); }
    return;
  }
  next(err);
};

module.exports = { handleError };
