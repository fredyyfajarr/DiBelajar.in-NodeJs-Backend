import mongoose from 'mongoose';

const assignmentSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
  },
  submissionFileUrl: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: '',
  },
  status: {
    type: String,
    enum: ['submitted', 'graded'],
    default: 'submitted',
  },
  gradedAt: {
    type: Date,
    default: null,
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

assignmentSubmissionSchema.index({ materialId: 1, submittedAt: -1 });
assignmentSubmissionSchema.index({ userId: 1, materialId: 1 });

const AssignmentSubmission = mongoose.model(
  'AssignmentSubmission',
  assignmentSubmissionSchema
);

export default AssignmentSubmission;
