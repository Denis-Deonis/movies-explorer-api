const moviesRouter = require('express').Router();

const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validationCreateMovie } = require('../utils/validations');

moviesRouter.get('/', getAllMovies);
moviesRouter.post('/', validationCreateMovie, createMovie);
moviesRouter.delete('/:movieId', deleteMovie);

module.exports = moviesRouter;
