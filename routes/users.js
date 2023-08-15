const usersRouter = require('express').Router();

const { getCurrentUser, updateProfile } = require('../controllers/user');
const { validationUpdateUser } = require('../utils/validations');

usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', validationUpdateUser, updateProfile);

module.exports = usersRouter;
