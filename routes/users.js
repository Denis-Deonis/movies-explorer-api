const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { updateProfile, getMyUser } = require('../controllers/users');

users.get('/me', getMyUser);

users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

module.exports = users;
