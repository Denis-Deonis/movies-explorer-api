const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { JWT_SECRET, NODE_ENV } = process.env;
const Users = require('../models/user');

const {
  NotFoundError,
  UnathorizedError,
  ConflictError,
} = require('../utils/errors/errors');


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

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => Users.create({ name, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким адресом электронной почты уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        return next(new NotFoundError('Отправленные неверные данные'));
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => findUser(req.user._id, res, next)

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new NotFoundError('Передан неверный id'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnathorizedError('Неверная почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnathorizedError('Неверный пароль или почта'));
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );
        res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, secure: true, sameSite: 'none' });
        return res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
      });
    })
    .catch(next);
};

module.exports.logout = (req, res) => res
  .clearCookie('jwt', {
    httpOnly: true,
    sameSite: true,
  })
  .send({ message: 'Вы успешно вышели из системы' });
