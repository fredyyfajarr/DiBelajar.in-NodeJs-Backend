import Joi from 'joi';

export const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required().messages({
    'number.base': 'Rating harus berupa angka',
    'number.min': 'Rating minimal adalah 1',
    'number.max': 'Rating maksimal adalah 5',
    'any.required': 'Rating wajib diisi',
  }),
  comment: Joi.string().trim().min(10).required().messages({
    'string.base': 'Komentar harus berupa teks',
    'string.empty': 'Komentar tidak boleh kosong',
    'string.min': 'Komentar harus memiliki minimal 10 karakter',
    'any.required': 'Komentar wajib diisi',
  }),
});
