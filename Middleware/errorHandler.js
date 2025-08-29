const errorHandler = (err, req, res, next) => {
  // Tangani error Joi (Validasi)
  if (err.isJoi) {
    return res.status(400).json({ error: err.details[0].message });
  }

  // Tangani error CastError Mongoose (ID tidak valid)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'ID not valid.' });
  }

  // Tangani error Mongoose lainnya, seperti duplikasi
  if (err.code && err.code === 11000) {
    return res.status(400).json({ error: 'Data already exists.' });
  }

  // Tangani error kustom lainnya
  if (err.message) {
    return res.status(400).json({ error: err.message });
  }

  // Fallback untuk error server internal
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error.' });
};

export default errorHandler;
