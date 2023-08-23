const router = require('express').Router()
const { errors } = require('celebrate')
const cors = require('cors');
const {
  validateLogin,
  validateCreateUser,
} = require('../middlewares/celebrate')
const { login, createUser } = require('../controllers/users')

// получение мидлвары для проверки токена в запросе
const { validateToken } = require('../middlewares/auth')
const usersRouter = require('./users')
const moviesRouter = require('./movies')
const { BadRequestError } = require('../utils/error')

router.use(cors());

router.post('/signin', validateLogin, login)
router.post('/signup', validateCreateUser, createUser)
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Exit' })
})

router.use('/users', validateToken, usersRouter)
router.use('/movies', validateToken, moviesRouter)
router.use('/*', validateToken, (req, res, next) =>
  next(new BadRequestError('Эта страница не найдена'))
)

// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер вот-вот выйдет из строя')
//   }, 0)
// })

router.use(errors())

module.exports = router
