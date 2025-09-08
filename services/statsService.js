import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import TestResult from '../models/TestResult.js';
import Material from '../models/Material.js';

/**
 * Mengambil statistik utama untuk dasbor admin.
 * @returns {Promise<object>} Objek yang berisi statistik dasbor.
 */
export const getDashboardStats = async () => {
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

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    recentUsers,
    recentCourses,
  };
};

/**
 * Mengambil data analitik untuk sebuah kursus spesifik.
 * @param {string} courseId - ID dari kursus.
 * @returns {Promise<object>} Objek yang berisi data analitik kursus.
 */
export const getCourseAnalytics = async (courseId) => {
  // Ambil semua materi yang ada di kursus ini
  const materialsInCourse = await Material.find({ courseId }).select('_id');
  const materialIds = materialsInCourse.map((m) => m._id);

  // Jalankan semua query analitik secara paralel
  const [
    totalEnrollments,
    completedEnrollments,
    avgTestScores,
    recentEnrollments,
  ] = await Promise.all([
    Enrollment.countDocuments({ courseId }),
    Enrollment.countDocuments({ courseId, completedAt: { $ne: null } }),
    TestResult.aggregate([
      { $match: { materialId: { $in: materialIds } } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
        },
      },
    ]),
    Enrollment.find({ courseId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email'),
  ]);

  const completionRate =
    totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;
  const overallAvgScore =
    avgTestScores.length > 0 ? avgTestScores[0].avgScore : 0;

  return {
    totalEnrollments,
    completionRate: completionRate.toFixed(1),
    overallAvgScore: overallAvgScore.toFixed(1),
    recentEnrollments,
  };
};
