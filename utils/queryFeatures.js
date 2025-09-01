// File: utils/queryFeatures.js

/**
 * Mengurai parameter 'page' dan 'limit' dari query string
 * @param {object} query - Objek req.query dari Express
 * @returns {object} - Berisi { limit, skip } untuk query Mongoose
 */
export const getPaginationOptions = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10; // Default 10 item per halaman
  const skip = (page - 1) * limit;

  return { limit, skip };
};

/**
 * Mengurai parameter 'sort' dari query string
 * @param {object} query - Objek req.query dari Express
 * @returns {string} - String untuk .sort() di Mongoose
 */
export const getSortOptions = (query) => {
  // Jika ada parameter sort, gunakan. Jika tidak, urutkan berdasarkan yang terbaru.
  return query.sort ? query.sort.split(',').join(' ') : '-createdAt';
};
