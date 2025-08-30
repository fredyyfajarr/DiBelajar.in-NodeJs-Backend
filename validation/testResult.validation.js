import Joi from 'joi';

export const createTestResultSchema = Joi.object({
  userIdOrSlug: Joi.string().required().messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required',
  }),
  score: Joi.number().required().messages({
    'number.base': 'Score must be a number',
    'any.required': 'Score is required',
  }),
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.string().required().messages({
        'string.base': 'Question ID must be a string',
        'any.required': 'Question ID is required',
      }),
      answer: Joi.string().required().messages({
        'string.base': 'Answer must be a string',
        'any.required': 'Answer is required',
      }),
    })
  ),
});
