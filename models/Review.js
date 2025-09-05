import mongoose from 'mongoose';

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

// Pastikan setiap user hanya bisa memberi satu review per kursus
reviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
