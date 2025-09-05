// src/validation/material.validation.js
import Joi from 'joi';

// Skema untuk Opsi Jawaban
const optionSchema = Joi.object({
  optionText: Joi.string().required(),
  isCorrect: Joi.boolean().required(),
}).unknown(true); // <-- PERBAIKAN 1: Izinkan field tambahan seperti _id

// Skema untuk Pertanyaan
const questionSchema = Joi.object({
  questionText: Joi.string().required(),
  options: Joi.array().items(optionSchema).min(2).required(),
}).unknown(true); // <-- PERBAIKAN 2: Izinkan field tambahan seperti _id

export const createMaterialSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  testContent: Joi.array().items(questionSchema).optional(),
});

export const updateMaterialSchema = Joi.object({
  title: Joi.string().trim().optional(), // Tambahkan .trim()
  description: Joi.string().trim().optional(), // Tambahkan .trim()
  testContent: Joi.array().items(questionSchema).optional(),
  // PERBAIKAN: Secara eksplisit larang field lain yang tidak seharusnya dikirim
  _id: Joi.any().strip(),
  courseId: Joi.any().strip(),
  slug: Joi.any().strip(),
  createdAt: Joi.any().strip(),
  updatedAt: Joi.any().strip(),
  __v: Joi.any().strip(),
});
