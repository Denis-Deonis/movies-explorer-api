const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const Users = require('../models/user');
const { handleError } = require('../utils/handleError');
const { SUCCESS_CREATED_CODE } = require('../utils/constants');

const UnauthorizedError = require('../utils/errors/UnauthorizedError');

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      Users.create({ name, email, password: hash })
        .then((user) => {
          const userObj = user.toObject();
          delete userObj.password;
          res.status(SUCCESS_CREATED_CODE).send(userObj);
        })
        .catch((err) => handleError(err, next));
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  Users.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => handleError(err, next));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => handleError(err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неверная почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError('Неверный пароль или почта'));
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );
        res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true });
        return res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
      });
    })
    .catch((err) => handleError(err, next));
};

module.exports.logout = (req, res) => res
  .clearCookie('jwt', {
    httpOnly: true,
    sameSite: true,
  })
  .send({ message: 'Вы успешно вышели из системы' });
