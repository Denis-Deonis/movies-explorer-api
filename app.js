require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authLimiter = require('./middlewares/rateLimiter');
const { PORT, DB_PATH } = require('./utils/config');
const routes = require('./routes/index');
const ServerError = require('./utils/errors/ServerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();


app.use(cors({
  origin: [
    'https://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'https://api.nomoreparties.co',
    'http://denis777.nomoreparties.co',
    'https://denis777.nomoreparties.co',
    'https://denis777.nomoreparties.co/signin',
    'https://denis777.nomoreparties.co/signup',
    'https://denis777.nomoreparties.co/signout',
    'https://denis777.nomoreparties.co/users/me',
    'https://denis777.nomoreparties.co/movies'
  ],
  credentials: true,
  maxAge: 30,
}));

app.use(authLimiter);

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use(cors());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(ServerError);

mongoose
  .connect(DB_PATH)
  .then(() => console.log('БД подключена'))
  .catch(() => console.log('Не удалось подключиться к БД'));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
