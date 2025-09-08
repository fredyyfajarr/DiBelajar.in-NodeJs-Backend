import Review from '../models/Review.js';
import Enrollment from '../models/Enrollment.js';

export const getReviewsByCourse = async (courseId) => {
  return Review.find({ courseId }).populate({
    path: 'userId',
    select: 'name',
  });
};

export const getReviewByUserAndCourse = async (userId, courseId) => {
  return Review.findOne({ userId, courseId }).populate({
    path: 'userId',
    select: 'name',
  });
};

export const addReview = async (userId, courseId, reviewData) => {
  // Verifikasi apakah pengguna sudah menyelesaikan kursus
  const enrollment = await Enrollment.findOne({
    userId,
    courseId,
    completedAt: { $ne: null },
  });

  if (!enrollment) {
    const error = new Error(
      'Anda harus menyelesaikan kursus ini terlebih dahulu untuk memberikan ulasan.'
    );
    error.statusCode = 403; // Forbidden
    throw error;
  }

  // Tambahkan data pengguna dan kursus ke body review
  reviewData.userId = userId;
  reviewData.courseId = courseId;

  return Review.create(reviewData);
};

export const updateReview = async (userId, courseId, updateData) => {
  const review = await Review.findOne({ userId, courseId });

  if (!review) {
    const error = new Error('Ulasan tidak ditemukan.');
    error.statusCode = 404; // Not Found
    throw error;
  }

  review.rating = updateData.rating;
  review.comment = updateData.comment;

  return review.save();
};

export const deleteReview = async (userId, courseId) => {
  const deletedReview = await Review.findOneAndDelete({ userId, courseId });

  if (!deletedReview) {
    const error = new Error('Ulasan tidak ditemukan.');
    error.statusCode = 404; // Not Found
    throw error;
  }

  return deletedReview;
};
