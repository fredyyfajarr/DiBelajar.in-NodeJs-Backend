import AssignmentSubmission from '../models/AssignmentSubmission.js';
import { buildQuery } from '../utils/queryFeatures.js';

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
    const conditions = { materialId };
    const populateOptions = [{ path: 'userId', select: 'name' }]; // <-- Tambahkan ini
    return await buildQuery(AssignmentSubmission, conditions, populateOptions);
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
