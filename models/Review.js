import mongoose from 'mongoose';
import Course from './Course.js'; // <-- Import model Course

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Rating wajib diisi.'],
  },
  comment: {
    type: String,
    trim: true,
    required: [true, 'Komentar ulasan wajib diisi.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

reviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });

// --- TAMBAHKAN LOGIKA KALKULASI DI SINI ---

// Static method untuk menghitung rata-rata rating
reviewSchema.statics.getAverageRating = async function (courseId) {
  const obj = await this.aggregate([
    {
      $match: { courseId: courseId },
    },
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    const stats = obj[0];
    if (stats) {
      await Course.findByIdAndUpdate(courseId, {
        averageRating: Math.round(stats.averageRating * 10) / 10, // Dibulatkan ke 1 desimal
        reviewCount: stats.reviewCount,
      });
    } else {
      // Jika tidak ada review, reset ke 0
      await Course.findByIdAndUpdate(courseId, {
        averageRating: 0,
        reviewCount: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Panggil getAverageRating setelah review disimpan
reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.courseId);
});

// Panggil getAverageRating sebelum review dihapus
reviewSchema.post('remove', function () {
  this.constructor.getAverageRating(this.courseId);
});
// -----------------------------------------

const Review = mongoose.model('Review', reviewSchema);

export default Review;
