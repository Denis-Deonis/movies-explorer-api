module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
  return next();
};