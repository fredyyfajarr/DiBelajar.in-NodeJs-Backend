import * as categoryService from '../services/categoryService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    sendSuccess(res, { data: categories, meta: { count: categories.length } });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    sendSuccess(res, { data: category, statusCode: 201 });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategoryById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: 'Kategori tidak ditemukan' });
    }
    sendSuccess(res, { data: {} });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    sendSuccess(res, {
      data: category,
      message: 'Kategori berhasil diperbarui',
    });
  } catch (error) {
    next(error);
  }
};
