const movieSchema = require('../models/movie');

const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../utils/error');

module.exports.getAllMovies = (req, res, next) => {
  movieSchema
    .find({ owner: req.user._id })
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  movieSchema
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user._id,
      movieId,
      nameRU,
      nameEN,
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new NotFoundError('Неверные данные при публикации фильма'));
      }

      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  movieSchema
    .findById(movieId)
    .orFail(new BadRequestError(`Фильм с таким Id: ${movieId} не найден`))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Вы не можете удалить чужой фильм'));
      }

      return movie;
    })
    .then((movie) => movieSchema.deleteOne(movie))
    .then(() => res.status(200).send({ message: 'Фильм удален' }))
    .catch(next);
};
