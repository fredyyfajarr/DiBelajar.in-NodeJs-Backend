import * as authService from '../services/authService.js';
import {
  clearRefreshTokenCookie,
  sendRefreshTokenCookie,
} from '../utils/authCookies.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(
      email,
      password
    );

    sendRefreshTokenCookie(res, refreshToken);

    sendSuccess(res, { token: accessToken, data: user });
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

    sendSuccess(res, {
      statusCode: 201,
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

    clearRefreshTokenCookie(res);
    sendSuccess(res, { message: 'User logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const newAccessToken = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, { token: newAccessToken });
  } catch (error) {
    next(error); // <-- Disederhanakan
  }
};

export const me = (req, res) => {
  sendSuccess(res, { data: req.user });
};

export const forgotPassword = async (req, res, next) => {
  try {
    await authService.processForgotPassword(
      req.body.email,
      req.protocol,
      req.get('host')
    );
    sendSuccess(res, {
      message: 'If a user with that email exists, a reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.resetPassword(
      req.params.token,
      req.body.password
    );

    sendRefreshTokenCookie(res, refreshToken);

    sendSuccess(res, { token: accessToken, data: user });
  } catch (error) {
    next(error); // <-- Disederhanakan
  }
};
