const { config } = require('dotenv');

if (process.env.NODE_ENV === 'production') {
  config();
}

const {
  PORT = 3000,
  DB_PATH = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  BASE_URL = 'http://localhost',
  LOGGER_BASE_URL = 'http://localhost:3100',
  NODE_ENV,
} = process.env;

module.exports = {
  PORT,
  DB_PATH,
  BASE_URL,
  LOGGER_BASE_URL,
  NODE_ENV,
};
