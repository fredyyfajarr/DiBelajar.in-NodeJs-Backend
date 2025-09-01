import AssignmentSubmission from '../models/AssignmentSubmission.js';

export const createSubmission = async (
  userId,
  materialId,
  submissionFileUrl
) => {
  try {
    const newSubmission = await AssignmentSubmission.create({
      userId,
      materialId,
      submissionFileUrl,
    });
    return newSubmission;
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
};

export const findSubmissionsByMaterialId = async (materialId, options = {}) => {
  try {
    const sort = options.sort || '-submittedAt';
    const skip = options.skip || 0;
    const limit = options.limit || 10;
    const submissions = await AssignmentSubmission.find({ materialId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return submissions;
  } catch (error) {
    console.error('Error finding submissions:', error);
    throw error;
  }
};

export const findSubmissionsByUserId = async (userId, options = {}) => {
  try {
    const sort = options.sort || '-submittedAt';
    const skip = options.skip || 0;
    const limit = options.limit || 10;
    const submissions = await AssignmentSubmission.find({ userId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return submissions;
  } catch (error) {
    console.error('Error finding submissions:', error);
    throw error;
  }
};
