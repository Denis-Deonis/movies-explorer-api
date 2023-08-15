const userRoutes = require('express').Router();

const { updateUserName, getMe } = require('../controllers/user');
const { validateUserInfo } = require('../utils/validators/userValidator');

userRoutes.get('/me', getMe);
userRoutes.patch('/me', validateUserInfo, updateUserName);

module.exports = userRoutes;