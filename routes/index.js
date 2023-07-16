const router = require('express').Router();
const { errors } = require('celebrate');

const { auth } = require('../middlewares/auth');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const { login, createUser, logout } = require('../controllers/user');
const NotFoundError = require('../utils/errors/NotFoundError');
const { validationLogin, validationCreateUser } = require('../utils/validations');

router.use(requestLogger);

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);
router.post('/signout', logout);

router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

router.use(errorLogger);
router.use(errors({ message: 'Ошибка валидации данных' }));

module.exports = router;
