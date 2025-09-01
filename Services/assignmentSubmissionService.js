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
    return await buildQuery(AssignmentSubmission, options, { materialId });
  } catch (error) {
    console.error('Error finding submissions:', error);
    throw error;
  }
};

export const findSubmissionsByUserId = async (userId, options = {}) => {
  try {
    return await buildQuery(AssignmentSubmission, options, { userId });
  } catch (error) {
    console.error('Error finding submissions:', error);
    throw error;
  }
};
