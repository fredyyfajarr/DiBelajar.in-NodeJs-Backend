import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorized, no token');
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      const error = new Error('User belonging to this token does not exist');
      error.statusCode = 401;
      return next(error);
    }
    next();
  } catch (error) {
    error.message = 'Not authorized, token failed';
    error.statusCode = 401;
    return next(error);
  }
};

// Middleware to authorize
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error('Not authorized, access denied');
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};

// Middleware to authorize self or admin
export const authorizeSelfOrAdmin = (req, res, next) => {
  const idFromParams = req.params.idOrSlug || req.params.userIdOrSlug;

  if (req.user.role === 'admin') {
    return next();
  }

  if (
    idFromParams === req.user.id.toString() ||
    idFromParams === req.user.slug
  ) {
    return next();
  }

  const error = new Error('Not authorized, access denied');
  error.statusCode = 403;
  return next(error);
};

// Middleware to make sure the user is enrolled in the course
export const authorizeEnrolled = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Langsung gunakan req.course yang sudah disiapkan oleh middleware loadCourse
    const course = req.course;

    if (!course) {
      // Seharusnya tidak pernah terjadi jika urutan middleware benar,
      // tapi ini sebagai pengaman.
      const error = new Error('Course not found in context');
      error.statusCode = 404;
      return next(error);
    }

    const enrollment = await Enrollment.findOne({
      userId: userId,
      courseId: course._id,
    });

    // Izinkan akses jika:
    // 1. Pengguna adalah admin
    // 2. Pengguna adalah instruktur pemilik kursus
    // 3. Pengguna terdaftar (enrollment ditemukan)
    if (
      req.user.role === 'admin' ||
      (course.instructorId &&
        course.instructorId.toString() === userId.toString()) ||
      enrollment
    ) {
      return next();
    }

    // Jika tidak memenuhi semua kondisi di atas, tolak akses.
    const error = new Error('You are not enrolled in this course');
    error.statusCode = 403;
    return next(error);
  } catch (error) {
    next(error);
  }
};
