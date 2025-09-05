import mongoose from 'mongoose';

// Skema ini mendefinisikan bagaimana progres untuk SATU materi akan dilacak.
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
    // Menggunakan angka untuk menghitung jumlah postingan forum.
    forumPostCount: {
      type: Number,
      default: 0,
    },
    // Menjadi true jika siswa sudah menekan tombol "Selesaikan Materi".
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
); // _id tidak diperlukan untuk sub-dokumen ini

// Skema utama untuk data pendaftaran (enrollment).
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
  // Setiap pendaftaran akan memiliki array yang berisi progres untuk setiap materi.
  progress: [materialProgressSchema],
  completedAt: {
    type: Date,
    default: null,
  },
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
