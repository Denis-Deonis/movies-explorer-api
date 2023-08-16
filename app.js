const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/handleErrors');
const cors = require('./middlewares/cors');
const router = require('./routes');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());

app.use(cors);

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
