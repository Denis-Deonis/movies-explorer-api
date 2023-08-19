// получаем переменные из .env среды
const { NODE_ENV, JWT_SECRET } = process.env;

// модуль для создания и подтверждения токенов
const jwt = require('jsonwebtoken');

// подключаем 401 ошибку авторизации
const { UnathorizedError } = require('../utils/error');

module.exports.validateToken = (req, res, next) => {
  // получаем токен из запроса
  const token = req.cookies.jwt;
  let payload;

  try {
    // проверяем токен
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new UnathorizedError('Authorization required'));
  }
  req.user = payload;
  return next();
};
