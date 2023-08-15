const router = require('express').Router();
const { errors } = require('celebrate');

const auth  = require('../middlewares/auth');

const moviesRouter = require('./movies');
const usersRouter = require('./users');

const { login, createUser } = require('../controllers/user');
const { validateLogin, validateRegister } = require('../utils/validators/userValidator');

const { errorLogger, requestLogger } = require('../middlewares/logger');

router.use(requestLogger);
router.use(cors({
  origin: [
    'https://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'https://api.nomoreparties.co',
    'http://denis777.nomoreparties.co',
    'https://denis777.nomoreparties.co',
    'https://denis777.nomoreparties.co/signin',
    'https://denis777.nomoreparties.co/signup',
    'https://denis777.nomoreparties.co/signout',
    'https://denis777.nomoreparties.co/users/me',
    'https://denis777.nomoreparties.co/movies',
  ],
  credentials: true,
  maxAge: 777,
}));


router.post('/signin', validateLogin, login);
router.post('/signup', validateRegister, createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый адрес не найден. Проверьте URL и метод запроса'));
});
router.use(errorLogger);
router.use(errors({ message: 'Ошибка валидации данных' }));

module.exports = router;