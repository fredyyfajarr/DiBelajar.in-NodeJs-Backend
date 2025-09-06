import Joi from 'joi';
import mongoose from 'mongoose';

const objectIdValidator = (value, helpers) => {
  if (!value || !mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const createCourseSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required()
    .messages({ 'string.empty': 'Judul wajib diisi' }),
  description: Joi.string()
    .trim()
    .required()
    .messages({ 'string.empty': 'Deskripsi wajib diisi' }),
  category: Joi.string()
    .custom(objectIdValidator, 'ObjectID Validation')
    .required()
    .messages({
      'any.invalid': 'ID Kategori tidak valid',
      'any.required': 'Kategori wajib dipilih',
    }),
  instructorId: Joi.string()
    .custom(objectIdValidator, 'ObjectID Validation')
    .required()
    .messages({
      'any.invalid': 'InstrukturId harus ObjectId yang valid',
      'any.required': 'Instruktur wajib dipilih',
    }),
});

export const updateCourseSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  category: Joi.string()
    .custom(objectIdValidator, 'ObjectID Validation')
    .optional(),
  instructorId: Joi.string()
    .custom(objectIdValidator, 'ObjectID Validation')
    .optional(),
});
