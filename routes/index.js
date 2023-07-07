const router = require('express').Router();

const auth = require('../middlewares/auth');
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const { createUser, logout, login } = require('../controllers/user');
const { NotFoundError } = require('../utils/errors');
const { validationLogin, validationCreateUser } = require('../utils/validations');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth);

router.post('/signout', logout);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError());
});

module.exports = router;
