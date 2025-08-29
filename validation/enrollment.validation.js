import Joi from 'joi';

export const createEnrollmentSchema = Joi.object({
  // userId: Joi.string().required().messages({
  //   'string.base': 'User ID must be a string',
  //   'any.required': 'User ID is required',
  // }),
  courseId: Joi.string().required().messages({
    'string.base': 'Course ID must be a string',
    'any.required': 'Course ID is required',
  }),
});
