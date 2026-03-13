const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: []
  });
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = Array.isArray(err.errors) ? err.errors : [];

  if (err.code === 'P2002') {
    statusCode = 400;
    message = 'Duplicate record';
  }

  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Related record does not exist';
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  if (err.code === '22P02') {
    statusCode = 400;
    message = 'Invalid input format';
  }

  if (err.code === '23505' && !err.statusCode) {
    statusCode = 400;
    message = 'Duplicate record';
  }

  if (err.code === '23503' && !err.statusCode) {
    statusCode = 400;
    message = 'Related record does not exist';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = {
  notFound,
  errorHandler
};
