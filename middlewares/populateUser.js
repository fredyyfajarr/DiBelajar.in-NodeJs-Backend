import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware ini mencoba memverifikasi token JWT jika ada di header.
 * Jika token valid, ia akan mengisi req.user dengan data pengguna.
 * Jika tidak ada token atau token tidak valid, ia hanya akan melanjutkan (next())
 * tanpa menimbulkan error, sehingga memungkinkan akses publik.
 */
export const populateUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tambahkan user ke object request
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Jika token salah atau kadaluarsa, abaikan saja.
      // req.user tidak akan terisi, dan request akan tetap berjalan
      // sebagai request dari pengguna publik.
      console.error('Token tidak valid (opsional):', error.message);
    }
  }

  next();
};
