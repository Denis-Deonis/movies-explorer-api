const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const Users = require('../models/user');
const { SUCCESS_CREATED_CODE } = require('../utils/constants');
const { handleError } = require('../utils/handleError');

const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => {
      Users.create({
        name, email, password: hash,
      })
        .then(() => res.status(SUCCESS_CREATED_CODE).send({ name, email }))
        .catch((err) => handleError(err, next));
    })
    .catch(next);
};

const findUser = (req, res, next, userId) => {
  Users.findById(userId)
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => handleError(err, next));
};

// eslint-disable-next-line max-len
const updateUser = (req, res, next, updateData) => Users.findByIdAndUpdate(req.user._id, updateData, {
  new: true,
  runValidators: true,
})
  .orFail()
  .then((user) => res.send({ user }))
  .catch((err) => handleError(err, next));

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  return updateUser(req, res, next, { name, email });
};

const getCurrentUser = (req, res, next) => findUser(req, res, next, req.user._id);

// const //login = (req, res, next) => {
//   const { email, password } = req.body;
//   return Users.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
//       res.cookie('jwt', token, {
//         maxAge: 3600000 * 24 * 7,
//         httpOnly: true,
//         sameSite: true,
//       })
//         .send({ message: `С возвращением, ${user.name}` });
//     })
//     .catch((err) => handleError(err, next));
// };

const login = (req, res, next) => {
  const { email, password } = req.body;

  Users.findOne({ email })
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неверная почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UnauthorizedError('Неверный пароль или почта'));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        return res.send({ token });
      });
    })
    .catch((err) => handleError(err, next));
};

const logout = (req, res) => res
  .clearCookie('jwt', {
    httpOnly: true,
    sameSite: true,
  })
  .send({ message: 'Вы успешно вышели из системы' });

module.exports = {
  createUser,
  updateProfile,
  getCurrentUser,
  login,
  logout,
};
