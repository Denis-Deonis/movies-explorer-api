const { NODE_ENV, JWT_SECRET } = process.env

// модуль для хеширования пароля
const bcrypt = require('bcryptjs')

// модуль для создания и подтверждения токенов
const jwt = require('jsonwebtoken')
const userSchema = require('../models/users')

const {
  NotFoundError,
  UnathorizedError,
  BadRequestError,
  ConflictError,
} = require('../utils/error')

module.exports.login = (req, res, next) => {
  const { email, password } = req.body

  return userSchema
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(
          new UnathorizedError('неверный адрес электронной почты или пароль')
        )
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(
            new UnathorizedError('неверный адрес электронной почты или пароль')
          )
        }

        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' }
        )
       return res.send({
               _id: user._id,
              name: user.name,
              email: user.email,
              jwt: token
       });
      })
    })
    .catch(next)
}

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      userSchema.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userObj = user.toObject()
      delete userObj.password
      res.status(201).send(userObj)
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError(
            'Пользователь с таким адресом электронной почты уже зарегистрирован'
          )
        )
      }

      if (err.name === 'ValidationError') {
        return next(new NotFoundError('Отправленные неверные данные'))
      }

      return next(err)
    })
}

module.exports.getUserById = (req, res, next) => {
  const userId = req.user._id

  userSchema
    .findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Отправленные неверные данные'))
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(
          new BadRequestError(`Пользователь с таким Id: ${userId} не найден`)
        )
      }

      return next(res)
    })
}

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body

  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError(
            'Пользователь с таким адресом электронной почты уже зарегистрирован'
          )
        )
      }

      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new NotFoundError('Отправленные неверные данные'))
      }

      return next(err)
    })
}
