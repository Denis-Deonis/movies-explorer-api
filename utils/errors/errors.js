const NotFoundError = require('./NotFoundError');
const UnathorizedError = require('./UnauthorizedError');
const ForbiddenError = require('./ForbiddenError');
const BadRequestError = require('./BadRequestError');
const ConflictError = require('./ConflictError');

module.exports = {
  NotFoundError,
  UnathorizedError,
  ForbiddenError,
  BadRequestError,
  ConflictError,
};
