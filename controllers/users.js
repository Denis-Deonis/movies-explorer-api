require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const AlreadyExistsError = require('../errors/AlreadyExistsError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/IncorrectError');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((data) => {
      res.status(201).send({
        name: data.name,
        email: data.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new AlreadyExistsError('Данный профиль уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные'));
      }
      return next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.getMyUser = (req, res, next) => {
  const { _id } = req.user;
  User.findOne({ _id })
    .then((data) => {
      res.send({
        name: data.name,
        email: data.email,
      });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Данного профиля не существует');
      }
      res.send({
        name: data.name,
        email: data.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyExistsError('Данный профиль уже существует'));
        return;
      }
      next(err);
    });
};
