export const sendSuccess = (
  res,
  { data = null, message = null, statusCode = 200, meta = {}, token = null } = {}
) => {
  const payload = {
    success: true,
    ...meta,
  };

  if (message) {
    payload.message = message;
  }

  if (token) {
    payload.token = token;
  }

  if (data !== null) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};
