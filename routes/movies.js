const movies = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const reg = /https?:\/\/(www\.)?([a-zA-Z0-9-._~:/?#@!$&'()+,;=]*)\.([a-zA-Z])#?/;

movies.get('/', getMovies);

movies.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(reg).required(),
    trailerLink: Joi.string().regex(reg).required(),
    thumbnail: Joi.string().regex(reg).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movies.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = movies;
