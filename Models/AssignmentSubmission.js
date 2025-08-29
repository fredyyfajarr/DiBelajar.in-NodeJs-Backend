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
  grade: Number,
});

const AssignmentSubmission = mongoose.model(
  'AssignmentSubmission',
  assignmentSubmissionSchema
);

export default AssignmentSubmission;
