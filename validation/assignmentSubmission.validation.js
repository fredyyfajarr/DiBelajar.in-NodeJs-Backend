import Joi from 'joi';

export const createSubmissionSchema = Joi.object({
  // userIdOrSlug: Joi.string().required().messages({
  //   'any.required': 'User ID is required',
  // }),
  submissionFileUrl: Joi.string().uri().required().messages({
    'string.uri': 'Submission file URL must be a valid URL',
    'any.required': 'Submission file URL is required',
  }),
});
