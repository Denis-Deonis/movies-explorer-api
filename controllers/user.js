const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const {
  NotFoundError,
  UnathorizedError,
  ConflictError,
} = require('../utils/errors/errors');

const { JWT_SECRET } = process.env;

const findUser = (id, res, next) => {
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(err);
    });
};

module.exports.getMe = (req, res, next) => findUser(req.user._id, res, next);

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email,
      password: hash,
      name,
    })
      .then((user) => {
        const userNoPassword = user.toObject({ useProjection: true });
        return res.status(200).send(userNoPassword);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Переданы не валидные данные'));
        }
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
        }
        return next(err);
      });
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неверная почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError('Неверная почта или пароль'));
        }
        const token = jwt.sign(
          { _id: user._id },
          process.env.NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-string',
          {
            expiresIn: '7d',
          },
        );
        return res.send({ token });
      });
    })
    .catch(next);
};

const updateUser = (id, data, res, next) => {
  User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не найден.'));
      }
      return next(err);
    });
};

module.exports.updateUserName = (req, res, next) => updateUser(req.user._id, req.body, res, next);