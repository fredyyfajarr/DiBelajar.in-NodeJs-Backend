// Di file: models/Enrollment.js

const materialProgressSchema = new mongoose.Schema({
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
  },
  hasCompletedTest: { type: Boolean, default: false },
  hasSubmittedAssignment: { type: Boolean, default: false },
  // --- UBAH BARIS INI ---
  forumPostCount: { type: Number, default: 0 }, // Ganti dari hasParticipatedInForum
  // --- ---
  isCompleted: { type: Boolean, default: false },
});
