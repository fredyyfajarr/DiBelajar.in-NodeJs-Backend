import Joi from 'joi';

export const createForumPostSchema = Joi.object({
  // userIdOrSlug: Joi.string().required().messages({
  //   'string.base': 'User ID must be a string',
  //   'any.required': 'User ID is required',
  // }),
  text: Joi.string().required().messages({
    'string.base': 'Text must be a string',
    'any.required': 'Text is required',
  }),
});
