const mongoose = require('mongoose');
const isURL = require('../utils/validations');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Поле страна должно быть заполнено'],
    },
    director: {
      type: String,
      required: [true, 'Поле режиссер должно быть заполнено'],
    },
    duration: {
      type: Number,
      required: [true, 'Поле длительность фильма должно быть заполнено'],
    },
    year: {
      type: String,
      required: [true, 'Поле год выпуска должно быть заполнено'],
    },
    description: {
      type: String,
      required: [true, 'Поле описание должно быть заполнено',],
    },
    image: {
      type: String,
      required: [true, 'Поле афиша должно быть заполнено'],
      validate: {
        validator: (url) => isURL.test(url),
        message: 'Некорректный URL',
      },
    },
    trailerLink: {
      type: String,
      required: [true, 'Поле трейлер должно быть заполнено'],
      validate: {
        validator: (url) => isURL.test(url),
        message: 'Некорректный URL',
      },
    },
    thumbnail: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      validate: {
        validator: (url) => isURL.test(url),
        message: 'Некорректный URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: [true, 'Поле должно быть заполнено'],
    },
    nameRU: {
      type: String,
      required: [true, 'Поле русское название фильма должно быть заполнено'],
    },
    nameEN: {
      type: String,
      required: [true, 'Поле английское название фильма должно быть заполнено'],
    },
  },
  { versionKey: false },
);

const Movies = mongoose.model('movie', movieSchema);

module.exports = { Movies };