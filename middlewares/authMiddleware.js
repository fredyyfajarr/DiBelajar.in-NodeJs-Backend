import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Course from '../models/Course.js';
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
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  console.log('Token:', token); // Debugging line to check the token value

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'User belonging to this token does not exist' });
    }
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware to authorize
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized, access denied' });
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

  return res.status(403).json({ message: 'Not authorized, access denied' });
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
      return res.status(404).json({ message: 'Course not found in context' });
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
    return res
      .status(403)
      .json({ message: 'You are not enrolled in this course' });
  } catch (error) {
    next(error);
  }
};
