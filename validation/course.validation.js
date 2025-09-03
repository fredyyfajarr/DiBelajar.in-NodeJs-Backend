// validation/course.validation.js
import Joi from 'joi';
import mongoose from 'mongoose';

const objectIdValidator = (value, helpers) => {
  // kalau null/undefined, langsung invalid
  if (!value) return helpers.error('any.required');

  // kalau sudah ObjectId (dari JSON)
  if (value instanceof mongoose.Types.ObjectId) {
    return value;
  }

  // kalau string → cek valid ObjectId
  if (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)) {
    return value;
  }

  return helpers.error('any.invalid');
};

export const createCourseSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Judul wajib diisi',
  }),
  description: Joi.string().trim().required().messages({
    'string.empty': 'Deskripsi wajib diisi',
  }),
  instructorId: Joi.alternatives()
    .try(Joi.string(), Joi.object())
    .custom(objectIdValidator)
    .required()
    .messages({
      'any.invalid': 'InstrukturId harus ObjectId yang valid',
      'any.required': 'Instruktur wajib dipilih',
    }),
});

export const updateCourseSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  instructorId: Joi.alternatives()
    .try(Joi.string(), Joi.object())
    .custom(objectIdValidator)
    .optional()
    .messages({
      'any.invalid': 'InstrukturId harus ObjectId yang valid',
    }),
});
