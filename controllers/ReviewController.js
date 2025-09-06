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
    const enrollment = await Enrollment.findOne({
      userId: req.user._id,
      courseId: req.course._id,
      completedAt: { $ne: null },
    });

    if (!enrollment) {
      return res.status(403).json({
        error:
          'Anda harus menyelesaikan kursus ini terlebih dahulu untuk memberikan ulasan.',
      });
    }

    req.body.courseId = req.course._id;
    req.body.userId = req.user._id;

    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Anda sudah pernah memberikan ulasan untuk kursus ini.',
      });
    }
    next(error);
  }
};

// @desc    Get the current user's review for a course
// @route   GET /api/courses/:courseId/reviews/my
export const getMyReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      userId: req.user._id,
      courseId: req.course._id,
    }).populate({
      path: 'userId', // Populasi user agar frontend bisa menampilkan nama
      select: 'name',
    });

    if (!review) {
      // PERBAIKAN: Kirim 200 OK dengan data null jika ulasan tidak ditemukan.
      return res.status(200).json({ success: true, data: null });
    }

    // Jika ulasan ditemukan, kirim datanya.
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Update the current user's review for a course
// @route   PUT /api/courses/:courseId/reviews/my
export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      userId: req.user._id,
      courseId: req.course._id,
    });

    if (!review) {
      return res.status(404).json({ error: 'Ulasan tidak ditemukan.' });
    }

    // Perbarui rating dan komentar
    review.rating = req.body.rating;
    review.comment = req.body.comment;

    await review.save();

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete the current user's review for a course
// @route   DELETE /api/courses/:courseId/reviews/my
export const deleteReview = async (req, res, next) => {
  try {
    // Cari dan hapus langsung ulasan yang cocok
    const deletedReview = await Review.findOneAndDelete({
      userId: req.user._id,
      courseId: req.course._id,
    });

    if (!deletedReview) {
      return res
        .status(404)
        .json({ success: false, error: 'Ulasan tidak ditemukan.' });
    }

    // Perhatikan: Hook post('remove') di model akan otomatis terpicu
    // saat dokumen dihapus, jadi rata-rata rating akan terperbarui.

    res
      .status(200)
      .json({ success: true, message: 'Ulasan berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};
