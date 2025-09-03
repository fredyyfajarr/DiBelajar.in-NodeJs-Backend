// src/validation/material.validation.js
import Joi from 'joi';

// Skema untuk Opsi Jawaban
const optionSchema = Joi.object({
  optionText: Joi.string().required(),
  isCorrect: Joi.boolean().required(),
});

// Skema untuk Pertanyaan
const questionSchema = Joi.object({
  questionText: Joi.string().required(),
  options: Joi.array().items(optionSchema).min(2).required(),
});

export const createMaterialSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  // testContent bersifat opsional, tapi jika ada, harus sesuai skema
  testContent: Joi.array().items(questionSchema).optional(),
});

export const updateMaterialSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  testContent: Joi.array().items(questionSchema).optional(),
});
