const { Movies } = require('../models/movie');
const { SUCCESS_CREATED_CODE } = require('../utils/constants');
const handleError = require('../utils/handleError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

module.exports.getAllMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movies) => res.send(movies.reverse()))
    .catch((err) => handleError(err, next));
};

module.exports.createMovie = (req, res, next) => {
  Movies.create({ owner: req.user._id, ...req.body })
    .then((newMovie) => {
      Movies.findById(newMovie._id)
        .populate(['owner'])
        .then((movie) => res.status(SUCCESS_CREATED_CODE).send(movie));
    })
    .catch((err) => handleError(err, next));
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movies.findById(movieId)
    .orFail()
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return movie.deleteOne().then(() => res.send(movie));
      }
      throw new ForbiddenError();
    })
    .catch((err) => handleError(err, next));
}