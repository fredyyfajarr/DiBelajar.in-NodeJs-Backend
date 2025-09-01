import * as userService from '../services/userService.js';
import * as authService from '../services/authService.js';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res
      .status(200)
      .json({ success: true, token: 'Bearer ' + token, data: user });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await userService.createUser({
      name,
      email,
      password,
      role: 'student',
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    newUser.password = undefined;

    res.status(201).json({
      success: true,
      message: 'User Registered Successfully',
      token: 'Bearer ' + token,
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  await res
    .status(200)
    .json({ success: true, message: 'User logged out successfully' });
};

export const forgotPassword = async (req, res, next) => {
  // 1. Deklarasikan 'user' di sini agar bisa diakses oleh try dan catch
  let user;

  try {
    // 2. Cari user berdasarkan email dan assign ke variabel 'user'
    user = await User.findOne({ email: req.body.email });

    // Jika user tidak ditemukan, tetap kirim respons sukses untuk keamanan
    // dan hentikan eksekusi.
    if (!user) {
      return res
        .status(200)
        .json({
          success: true,
          message:
            'If a user with that email exists, a reset link has been sent.',
        });
    }

    // Generate token reset
    const resetToken = user.createPasswordResetToken();
    // Gunakan { validateBeforeSave: false } agar validasi 'required' tidak berjalan
    await user.save({ validateBeforeSave: false });

    // Buat URL reset
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/reset-password/${resetToken}`;
    const message = `Anda menerima email ini karena Anda (atau orang lain) meminta reset password. Silakan buat request POST ke: \n\n ${resetURL}`;

    // Kirim email
    await sendEmail({
      email: user.email,
      subject: 'Link Reset Password (berlaku 10 menit)',
      message,
    });

    res.status(200).json({ success: true, message: 'Email has been sent' });
  } catch (error) {
    // Jika terjadi error, hapus token dari DB dan lanjutkan ke error handler
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    // 1. Hash token dari URL agar bisa dicocokkan dengan yang di DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Cari user berdasarkan token yang di-hash dan belum kedaluwarsa
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Token is invalid or has expired' });
    }

    // 3. Set password baru dan hapus token reset
    user.password = req.body.password; // Akan di-hash oleh pre-save hook di model User
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4. Buat token login baru dan kirim
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ success: true, token: 'Bearer ' + token });
  } catch (error) {
    next(error);
  }
};
