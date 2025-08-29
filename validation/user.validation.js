import Joi from 'joi';

// Validation schema for user data
export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('admin', 'instructor', 'user').required().messages({
    'any.only': 'Role not valid.',
    'any.required': 'Role is required',
  }),
});

// Validation schema for updaeting user data
export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 50 characters',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Invalid email format',
  }),
  password: Joi.string().min(8).optional().messages({
    'string.min': 'Password must be at least 8 characters',
  }),
  role: Joi.string().valid('admin', 'instructor', 'user').optional().messages({
    'any.only': 'Role not valid.',
  }),
});
