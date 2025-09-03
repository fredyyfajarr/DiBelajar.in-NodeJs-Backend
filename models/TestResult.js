import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
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
  score: {
    type: Number,
    required: true,
  },
  answers: [
    {
      questionId: String,
      answer: String,
    },
  ],
  completeAt: {
    type: Date,
    default: Date.now,
  },
});

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
