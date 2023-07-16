const { FORBIDDEN, DEFAULT_ERROR_MESSAGES } = require('../constants');

class ForbiddenError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.FORBIDDEN) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ForbiddenError;
