import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import TestResult from '../models/TestResult.js';
import Material from '../models/Material.js';

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

// FUNGSI BARU YANG SUDAH DIPERBAIKI
export const getCourseAnalytics = async (req, res, next) => {
  try {
    const courseId = req.course._id;

    // 2. Ambil semua materi yang ada di kursus ini
    const materialsInCourse = await Material.find({ courseId }).select('_id');
    const materialIds = materialsInCourse.map((m) => m._id);

    // Jalankan semua query secara paralel untuk efisiensi
    const [
      totalEnrollments,
      completedEnrollments,
      avgTestScores,
      recentEnrollments,
    ] = await Promise.all([
      Enrollment.countDocuments({ courseId }),
      Enrollment.countDocuments({ courseId, completedAt: { $ne: null } }),
      TestResult.aggregate([
        { $match: { materialId: { $in: materialIds } } }, // <-- 3. Gunakan array materialIds yang sudah kita ambil
        {
          $group: {
            _id: null, // Kita ingin rata-rata keseluruhan, bukan per materi
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
      totalEnrollments > 0
        ? (completedEnrollments / totalEnrollments) * 100
        : 0;
    const overallAvgScore =
      avgTestScores.length > 0 ? avgTestScores[0].avgScore : 0;

    res.status(200).json({
      success: true,
      data: {
        totalEnrollments,
        completionRate: completionRate.toFixed(1),
        overallAvgScore: overallAvgScore.toFixed(1),
        recentEnrollments,
      },
    });
  } catch (error) {
    next(error);
  }
};
