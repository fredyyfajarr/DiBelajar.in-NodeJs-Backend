const isProduction = process.env.NODE_ENV === 'production';

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const sendRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
};

export const clearRefreshTokenCookie = (res) => {
  const { maxAge, ...clearOptions } = getRefreshTokenCookieOptions();
  res.clearCookie('refreshToken', clearOptions);
};
