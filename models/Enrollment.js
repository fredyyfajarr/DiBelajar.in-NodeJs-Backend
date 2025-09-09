import mongoose from 'mongoose';

const materialProgressSchema = new mongoose.Schema(
  {
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: true,
    },
    hasCompletedTest: {
      type: Boolean,
      default: false,
    },
    hasSubmittedAssignment: {
      type: Boolean,
      default: false,
    },
    forumPostCount: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  progress: [materialProgressSchema],
  completedAt: {
    type: Date,
    default: null,
  },
});

// Membuat compound index untuk mempercepat query berdasarkan userId dan courseId
enrollmentSchema.index({ userId: 1, courseId: 1 }); // <-- DITAMBAHKAN

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
