import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    'string.base': 'Nama kategori harus berupa teks',
    'string.empty': 'Nama kategori tidak boleh kosong',
    'string.min': 'Nama kategori harus memiliki minimal 3 karakter',
    'string.max': 'Nama kategori tidak boleh lebih dari 50 karakter',
    'any.required': 'Nama kategori wajib diisi',
  }),
});
