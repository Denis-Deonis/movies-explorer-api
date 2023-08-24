const router = require('express').Router()
const { errors } = require('celebrate')
const {
  validateLogin,
  validateCreateUser,
} = require('../middlewares/celebrate')
const { login, createUser } = require('../controllers/users')

// получение мидлвары для проверки токена в запросе
const {auth} = require('../middlewares/auth');

const usersRouter = require('./users')
const moviesRouter = require('./movies')
const { BadRequestError } = require('../utils/error')

router.post('/signin', validateLogin, login)
router.post('/signup', validateCreateUser, createUser)
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Exit' })
})


router.use('/users', auth, usersRouter)
router.use('/movies', auth, moviesRouter)
router.use('/*', auth, (req, res, next) =>
  next(new BadRequestError('Эта страница не найдена'))
)

// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер вот-вот выйдет из строя')
//   }, 0)
// })

router.use(errors())

module.exports = router
