const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((data) => res.send(data))
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
  Movie.create({
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
    owner: req.user._id,
  })
    .then((data) => res.status(201).send(data))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('карточка с таким id не найдена');
      } else if (!(req.user._id === data.owner.toString())) {
        throw new ForbiddenError('нельзя удалить чужую карточку');
      }
      return Movie.deleteOne({ _id: data._id }).then(() => {
        res.send(data);
      });
    })
    .catch(next);
};
