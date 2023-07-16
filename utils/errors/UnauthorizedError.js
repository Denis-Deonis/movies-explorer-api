const { UNAUTHORIZED, DEFAULT_ERROR_MESSAGES } = require('../constants');

class UnauthorizedError extends Error {
  constructor(message = DEFAULT_ERROR_MESSAGES.UNAUTHORIZED) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
