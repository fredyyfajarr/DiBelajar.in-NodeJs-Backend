import * as reviewService from '../services/reviewService.js';

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByCourse(req.course._id);
    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const review = await reviewService.addReview(
      req.user._id,
      req.course._id,
      req.body
    );
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Anda sudah pernah memberikan ulasan untuk kursus ini.',
      });
    }
    // Menggunakan statusCode dari service jika ada
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

export const getMyReview = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewByUserAndCourse(
      req.user._id,
      req.course._id
    );
    // Service akan mengembalikan null jika tidak ada, jadi tidak perlu cek `!review` lagi.
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(
      req.user._id,
      req.course._id,
      req.body
    );
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.user._id, req.course._id);
    res
      .status(200)
      .json({ success: true, message: 'Ulasan berhasil dihapus.' });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    next(error);
  }
};
