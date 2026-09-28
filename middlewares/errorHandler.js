module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode).send({ message: err.message });
};

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message = "An error occurred on the server" } = err;

  res.status(statusCode).send({
    message,
  });
  console.error(err);
  res.status(err.statusCode).send({ message: err.message });
};

module.exports = errorHandler;
