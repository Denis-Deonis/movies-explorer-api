const router = require('express').Router();

const { getAllMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validationCreateMovie, validationId } = require('../utils/validations');

router.get('/', getAllMovies);
router.post('/', validationCreateMovie, createMovie);
router.delete('/:movieId', validationId(), deleteMovie);

module.exports = router;
