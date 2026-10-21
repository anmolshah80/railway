const { AppError } = require('../utils/error');
const { config } = require('../config');
const logger = require('../config/logger');

module.exports = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.code,
      message: error.message,
    });
  }

  console.error('UNHANDLED ERROR: ', error);

  if (config.NODE_ENV !== 'production') {
    logger.error({
      message: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
    });
  }

  return res.status(500).json({
    success: false,
    error: 'SERVER_ERROR',
    message: 'Internal Server Error',
  });
};
