import mongoose from 'mongoose';

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
  return query.sort ? query.sort.split(',').join(' ') : '-createdAt';
};

/**
 * Membuat query Mongoose dengan kondisi dan populasi
 * @param {mongoose.Model} model - Model Mongoose yang akan di-query
 * @param {object} conditions - Kondisi pencarian (misalnya, { materialId })
 * @param {array} populate - Array opsi populasi (opsional)
 * @returns {Promise} - Hasil query Mongoose
 */
export const buildQuery = async (model, conditions = {}, populate = []) => {
  let query = model.find(conditions);

  // Terapkan populasi jika ada
  if (populate.length > 0) {
    populate.forEach((pop) => {
      query = query.populate(pop);
    });
  }

  return await query.exec();
};
