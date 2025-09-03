import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    // Jalankan semua query secara paralel untuk efisiensi
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      recentUsers,
      recentCourses,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email'),
      Course.find().sort({ createdAt: -1 }).limit(5).select('title'),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        recentUsers,
        recentCourses,
      },
    });
  } catch (error) {
    next(error);
  }
};
