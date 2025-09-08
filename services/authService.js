import User from '../models/User.js';
import Token from '../models/Token.js'; // Impor model Token
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import * as userService from './userService.js';

// Fungsi utilitas untuk membuat token
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Umur pendek
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET, // Gunakan secret yang berbeda!
    { expiresIn: '7d' } // Umur panjang
  );

  // Hapus refresh token lama jika ada, untuk memastikan hanya 1 sesi aktif per login
  await Token.findOneAndDelete({ userId: user._id });

  // Simpan refresh token yang baru ke database
  await new Token({ userId: user._id, token: refreshToken }).save();

  return { accessToken: 'Bearer ' + accessToken, refreshToken };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Email atau password salah.');
  }

  const passwordIsMatch = await bcrypt.compare(password, user.password);
  if (!passwordIsMatch) {
    throw new Error('Email atau password salah.');
  }

  const tokens = await generateTokens(user);
  user.password = undefined;

  return { user, ...tokens };
};

export const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const newUser = await userService.createUser({
    name,
    email,
    password,
    role: 'student',
  });

  const tokens = await generateTokens(newUser);
  newUser.password = undefined;

  return { user: newUser, ...tokens };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }
  // Hapus token dari database untuk logout
  await Token.findOneAndDelete({ token: refreshToken });
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token tidak ditemukan.');
    error.statusCode = 401;
    throw error;
  }

  const tokenInDb = await Token.findOne({ token: refreshToken });
  if (!tokenInDb) {
    const error = new Error('Token tidak valid atau sesi telah berakhir.');
    error.statusCode = 403;
    throw error;
  }

  // Verifikasi refresh token
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Buat access token baru
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return 'Bearer ' + accessToken;
  } catch (err) {
    // Jika verifikasi gagal (misalnya, token kedaluwarsa)
    const error = new Error('Token tidak valid atau sesi telah berakhir.');
    error.statusCode = 403;
    throw error;
  }
};

export const processForgotPassword = async (email, protocol, host) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Untuk keamanan, kita tidak memberitahu jika email tidak ada.
    // Cukup kembalikan status sukses.
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${protocol}://${host}/api/auth/reset-password/${resetToken}`;
  const message = `Anda menerima email ini karena Anda (atau orang lain) meminta reset password. Silakan buat request POST ke: \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Link Reset Password (berlaku 10 menit)',
      message,
    });
  } catch (error) {
    // Jika email gagal dikirim, hapus token dari DB untuk coba lagi nanti
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error('Email could not be sent.');
  }
};

export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error('Token is invalid or has expired');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const loginToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return 'Bearer ' + loginToken;
};
