import Joi from 'joi';

// Skema untuk registrasi tidak berubah
export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('student', 'instructor', 'admin'),
});

// Skema untuk membuat pengguna (oleh admin)
export const createUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('student', 'instructor', 'admin').required(),
});

// Skema untuk memperbarui pengguna
export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  role: Joi.string().valid('student', 'instructor', 'admin').optional(),

  // --- TAMBAHKAN BARIS INI ---
  bio: Joi.string().allow('').optional(),
}).min(1); // Memastikan setidaknya ada satu field yang diisi

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({ 'any.only': 'Password baru tidak cocok' }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .optional()
    .messages({ 'any.only': 'Konfirmasi password tidak cocok' }),
});
