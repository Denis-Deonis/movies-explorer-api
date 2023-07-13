const { BAD_REQUEST, DEFAULT_ERROR_MESSAGES } = require('../constants');

class BadRequestError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.BAD_REQUEST) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = BadRequestError;