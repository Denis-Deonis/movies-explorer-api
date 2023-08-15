const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина поля 2 символа'],
      maxlength: [30, 'Максимальная длина поля 30 символов'],
    },
    email: {
      type: String,
      required: true,
      default: 'some@email.com',
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: () => 'Введен некорректный email адрес',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);