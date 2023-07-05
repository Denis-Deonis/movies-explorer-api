const { config } = require('dotenv')

if (process.env.NODE_ENV === 'production') {
  config()
}

const {
  PORT = 3000,
  DB_PATH = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  BASE_URL = 'http://localhost',
  JWT_SECRET = process.env.NODE_ENV === 'production'
    ? process.env.JWT_SECRET
    : 'some-secret-string',
  LOGGER_BASE_URL = 'http://localhost:3100',
  NODE_ENV,
} = process.env

module.exports = {
  PORT,
  DB_PATH,
  BASE_URL,
  JWT_SECRET,
  LOGGER_BASE_URL,
  MAX_AUTH_ATTEMPTS,
  NODE_ENV,
}