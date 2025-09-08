import * as authService from '../services/authService.js';

// Fungsi helper untuk mengirim cookie
const sendRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Tidak bisa diakses oleh JavaScript sisi klien
    secure: process.env.NODE_ENV === 'production', // Hanya kirim lewat HTTPS di produksi
    sameSite: 'strict', // Proteksi CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(
      email,
      password
    );

    sendRefreshTokenCookie(res, refreshToken);

    res.status(200).json({ success: true, token: accessToken, data: user });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.registerUser(
      req.body
    );

    sendRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: 'User Registered Successfully',
      token: accessToken,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await authService.logoutUser(refreshToken);

    // Hapus cookie di sisi klien
    res.clearCookie('refreshToken');
    res
      .status(200)
      .json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const newAccessToken = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ success: true, token: newAccessToken });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    await authService.processForgotPassword(
      req.body.email,
      req.protocol,
      req.get('host')
    );
    res.status(200).json({
      success: true,
      message: 'If a user with that email exists, a reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const token = await authService.resetPassword(
      req.params.token,
      req.body.password
    );
    res.status(200).json({ success: true, token });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};
