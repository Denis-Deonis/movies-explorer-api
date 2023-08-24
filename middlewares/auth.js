const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/error/401-unathorized');

const { JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return next(new UnauthorizedError(`Необходима авторизация ${authorization}`));
  // }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new UnauthorizedError(`Необходима авторизация ${authorization}`));
  }
  req.user = payload;
  return next();
};


