require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authLimiter = require('./middlewares/rateLimiter');
const { PORT, DB_PATH, BASE_URL } = require('./utils/config');
const routes = require('./routes/index');
const ServerError = require('./utils/errors/ServerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(authLimiter);
app.use(
  cors({
    origin: BASE_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  }),
);

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

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
