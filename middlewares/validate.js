// middleware/validate.js
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    next(error);
  } else {
    next();
  }
};
