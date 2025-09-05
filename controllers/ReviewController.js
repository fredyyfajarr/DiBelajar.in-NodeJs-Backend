import Review from '../models/Review.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get reviews for a course
// @route   GET /api/courses/:courseId/reviews
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      courseId: req.params.courseIdOrSlug,
    }).populate({
      path: 'userId',
      select: 'name',
    });
    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review
// @route   POST /api/courses/:courseId/reviews
export const addReview = async (req, res, next) => {
  try {
    // Cek dulu apakah siswa sudah menyelesaikan kursus
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: req.course._id,
      completedAt: { $ne: null }, // Pastikan completedAt tidak kosong
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({
          error:
            'Anda harus menyelesaikan kursus ini terlebih dahulu untuk memberikan ulasan.',
        });
    }

    req.body.courseId = req.course._id;
    req.body.userId = req.user._id;

    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    // Tangani error jika user mencoba review dua kali
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          error: 'Anda sudah pernah memberikan ulasan untuk kursus ini.',
        });
    }
    next(error);
  }
};
