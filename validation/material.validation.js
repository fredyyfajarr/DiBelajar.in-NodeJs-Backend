import Joi from 'joi';

export const createMaterialSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'Title must be a string',
    'any.required': 'Title is required',
  }),
  description: Joi.string().required().messages({
    'string.base': 'Description must be a string',
    'any.required': 'Description is required',
  }),
});

export const updateMaterialSchema = Joi.object({
  title: Joi.string().optional().messages({
    'string.base': 'Title must be a string',
  }),
  description: Joi.string().optional().messages({
    'string.base': 'Description must be a string',
  }),
});
