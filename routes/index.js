const router = require('express').Router();
const { errors } = require('celebrate');

const auth = require('../middlewares/auth');
const {requestLogger, errorLogger } = require('../middlewares/logger');
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const { createUser, logout, login } = require('../controllers/user');
const { NotFoundError } = require('../utils/errors');
const { validationLogin, validationCreateUser } = require('../utils/validations');

router.use(requestLogger);

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);
router.post('/signout', logout);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

router.use(errorLogger);
router.use(errors({ message: 'Ошибка валидации данных' }));

module.exports = router;
