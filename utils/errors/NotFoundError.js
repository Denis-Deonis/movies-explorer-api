const { NOT_FOUND, DEFAULT_ERROR_MESSAGES } = require('../constants');

class NotFoundError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.NOT_FOUND) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

module.exports = NotFoundError;