const allowedCors = [
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
  'https://denis777.nomoreparties.co/movies',
];

const cors = ((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }

  next();
});

module.exports = cors;
