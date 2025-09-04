import mongoose from 'mongoose';

const materialProgressSchema = new mongoose.Schema({
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
  },
  hasCompletedTest: { type: Boolean, default: false },
  hasSubmittedAssignment: { type: Boolean, default: false },
  hasParticipatedInForum: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }, // Status materi selesai
});

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
  progress: [materialProgressSchema], // Tambahkan ini
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
