import * as statsService from '../services/statsService.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await statsService.getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseAnalytics = async (req, res, next) => {
  try {
    const courseId = req.course._id;
    const analytics = await statsService.getCourseAnalytics(courseId);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};
