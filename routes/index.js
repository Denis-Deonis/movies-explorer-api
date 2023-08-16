const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, login } = require('../controllers/users');
const users = require('./users');
const movies = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

router.use('/movies', movies);
router.use('/users', users);

router.use('/', (req, res, next) => {
  next(new NotFoundError('Данная страница не найдена'));
});

module.exports = router;
