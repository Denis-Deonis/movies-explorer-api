/* eslint-disable max-classes-per-file */
const mongoose = require('mongoose');
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
  DEFAULT_ERROR_MESSAGES,
} = require('./constants');

class BadRequestError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.BAD_REQUEST) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

class UnauthorizedError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.UNAUTHORIZED) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

class ForbiddenError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.FORBIDDEN) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

class NotFoundError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.NOT_FOUND) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

class ConflictError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.CONFLICT) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

class ServerError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.SERVER_ERROR) {
    super(message);
    this.statusCode = SERVER_ERROR;
  }
}

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

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServerError,
  handleError,
};
