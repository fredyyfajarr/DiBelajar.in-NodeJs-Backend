import Category from '../models/Category.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res
      .status(200)
      .json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: 'Kategori tidak ditemukan' });
    }
    // Di sini Anda bisa menambahkan logika untuk mengecek apakah ada kursus yang masih menggunakan kategori ini sebelum menghapus
    await category.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
