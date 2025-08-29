import Joi from 'joi';

export const createCourseSchema = Joi.object({
  title: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Title must be a string',
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title must be at most 50 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().min(10).required().messages({
    'string.base': 'Description must be a string',
    'string.min': 'Description must be at least 10 characters',
    'any.required': 'Description is required',
  }),
  thumbnail: Joi.string().uri().optional().messages({
    'string.uri': 'Thumbnail must be a valid URL',
  }),
  instructorId: Joi.string().required(),
});

export const updateCourseSchema = Joi.object({
  title: Joi.string().min(3).max(50).optional().messages({
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title must be at most 50 characters',
  }),
  description: Joi.string().min(10).optional().messages({
    'string.min': 'Description must be at least 10 characters',
    'string.base': 'Description must be a string',
  }),
  thumbnail: Joi.string().uri().optional().messages({
    'string.uri': 'Thumbnail must be a valid URL',
  }),
  instructorId: Joi.string().optional().messages({
    'any.required': 'ID instruktur wajib diisi.',
  }),
});
