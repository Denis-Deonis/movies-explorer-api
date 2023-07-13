const { CONFLICT, DEFAULT_ERROR_MESSAGES } = require('../constants');

class ConflictError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.CONFLICT) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = ConflictError;