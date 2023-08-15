const movieRoutes = require('express').Router();

const { getMovies, deleteMovie, createMovie } = require('../controllers/movies');
const { validateMovieId, validateMovie } = require('../utils/validators/movieValidator');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', validateMovie, createMovie);

movieRoutes.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = movieRoutes;