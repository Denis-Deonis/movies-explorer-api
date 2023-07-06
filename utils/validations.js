const { celebrate, Joi } = require('celebrate');
const { Types } = require('mongoose');
const { URL } = require('validator');

const { BadRequestError } = require('./errors');

const isURL = /^(https?:\/\/)(www\.)?(?!-)[-a-zA-Z0-9@:%._~#=]{1,249}(?<!-)\.[A-Za-z]{2,6}([-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]*)#?$/;

const validationUrl = (url) => {
  if (URL(url)) {
    return url
  }
  throw new BadRequestError()
}

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Поле email должно быть заполнено'),
    password: Joi.string().required(),
  }),
})

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .message('Имя пользователя должно быть заполнено и содержать не менее 2 и не более 30 миволов'),
    email: Joi.string()
      .required()
      .email()
      .message('Поле email должно быть заполнено'),
    password: Joi.string().required(),
  }),
})


const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .message('Имя пользователя должно быть заполнено и содержать не менее 2 и не более 30 миволов'),
    email: Joi.string()
      .required()
      .email()
      .message('Поле email должно быть заполнено'),
  }),
})

const validationId = (schema = 'movieId') =>
  celebrate({
    params: Joi.object().keys({
      [schema]: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!Types.ObjectId.isValid(value)) {
            return helpers.message('Передан некорректный id фильма')
          }
          return value
        }),
    }),
  })

const validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string()
      .required()
      .min(1)
      .message('Поле страна должно быть заполнено'),
    director: Joi.string()
      .required()
      .min(1)
      .message('Поле режиссер должно быть заполнено'),
    duration: Joi.number()
      .required()
      .min(1)
      .message('Поле длительность фильма должно быть заполнено'),
    year: Joi.string().required().min(1).message('Поле год выпуска должно быть заполнено'),
    description: Joi.string()
      .required()
      .min(1)
      .message('Поле описание должно быть заполнено'),
    image: Joi.string()
      .required()
      .custom(validationUrl)
      .message('Поле афиша должно быть заполнено'),
    trailerLink: Joi.string()
      .required()
      .custom(validationUrl)
      .message('Поле трейлер должно быть заполнено'),
    thumbnail: Joi.string()
      .required()
      .custom(validationUrl)
      .message('Поле должно быть заполнено'),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(1).message('Поле русское название фильма должно быть заполнено'),
    nameEN: Joi.string().required().min(1).message('Поле иностранное название фильма должно быть заполнено'),
  }),
})


module.exports = {
  isURL,
  validationLogin,
  validationCreateUser,
  validationUpdateUser,
  validationCreateMovie,
  validationId
};