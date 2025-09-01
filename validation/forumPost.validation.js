import Joi from 'joi';

export const createForumPostSchema = Joi.object({
  text: Joi.string().required().messages({
    'string.base': 'Text must be a string',
    'any.required': 'Text is required',
  }),
});
