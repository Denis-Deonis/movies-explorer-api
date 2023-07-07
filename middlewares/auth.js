const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const { UnauthorizedError } = require('../utils/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError());
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      process.env.NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-string',
    );
  } catch (err) {
    return next(new UnauthorizedError());
  }
  req.user = payload;
  return next();
};
