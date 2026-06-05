import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  // Tangani error Joi (Validasi)
  if (err.isJoi) {
    const message = err.details[0].message;
    return res.status(400).json({ error: message, message });
  }

  // Tangani error CastError Mongoose (ID tidak valid)
  if (err.name === 'CastError') {
    return res
      .status(400)
      .json({ error: 'ID not valid.', message: 'ID not valid.' });
  }

  // Tangani error ValidationError Mongoose
  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .json({ error: 'Validation error.', message: 'Validation error.' });
  }

  // Tangani error Mongoose lainnya, seperti duplikasi
  if (err.code && err.code === 11000) {
    return res
      .status(400)
      .json({ error: 'Data already exists.', message: 'Data already exists.' });
  }
  // Tangani error MongoDB
  if (err.name === 'MongoError') {
    return res
      .status(500)
      .json({ error: 'MongoDB error.', message: 'MongoDB error.' });
  }

  // Tangani error jsonwebtoken
  if (err.name === 'JsonWebTokenError') {
    return res
      .status(401)
      .json({ error: 'Invalid token.', message: 'Invalid token.' });
  }

  // Tangani error token expired
  if (err.name === 'TokenExpiredError') {
    return res
      .status(401)
      .json({ error: 'Token expired.', message: 'Token expired.' });
  }

  // Tangani error kustom yang memang memberi status HTTP eksplisit
  const statusCode = err.statusCode || err.status;
  if (statusCode) {
    return res
      .status(statusCode)
      .json({ error: err.message, message: err.message });
  }

  // Fallback untuk error server internal
  logger.error(err.stack || err.message || err);
  res
    .status(500)
    .json({ error: 'Internal Server Error.', message: 'Internal Server Error.' });
};

export default errorHandler;
