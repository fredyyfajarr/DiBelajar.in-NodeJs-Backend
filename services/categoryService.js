import Category from '../models/Category.js';

/**
 * Mengambil semua kategori dari database, diurutkan berdasarkan nama.
 * @returns {Promise<Array>} Array dari dokumen kategori.
 */
export const getAllCategories = async () => {
  return Category.find().sort('name');
};

/**
 * Membuat kategori baru di database.
 * @param {object} categoryData - Data untuk kategori baru.
 * @returns {Promise<object>} Dokumen kategori yang baru dibuat.
 */
export const createCategory = async (categoryData) => {
  return Category.create(categoryData);
};

/**
 * Menghapus kategori berdasarkan ID.
 * @param {string} categoryId - ID dari kategori yang akan dihapus.
 * @returns {Promise<object|null>} Dokumen kategori yang dihapus, atau null jika tidak ditemukan.
 */
export const deleteCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    return null;
  }
  // Di sini Anda bisa menambahkan logika untuk mengecek apakah ada kursus yang masih menggunakan kategori ini sebelum menghapus
  await category.remove();
  return category;
};
