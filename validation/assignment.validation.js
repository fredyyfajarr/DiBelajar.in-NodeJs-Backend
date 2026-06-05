import Joi from 'joi';

export const gradeAssignmentSchema = Joi.object({
  grade: Joi.number().min(0).max(100).required().messages({
    'number.base': 'Nilai harus berupa angka',
    'number.min': 'Nilai minimal 0',
    'number.max': 'Nilai maksimal 100',
    'any.required': 'Nilai wajib diisi',
  }),
  feedback: Joi.string().trim().max(2000).allow('').optional().messages({
    'string.max': 'Feedback tidak boleh lebih dari 2000 karakter',
  }),
});
