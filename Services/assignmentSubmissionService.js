import AssignmentSubmission from '../Models/AssignmentSubmission.js';

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
    throw error;
  }
};

export const findSubmissionsByMaterialId = async (materialId) => {
  try {
    const submissions = await AssignmentSubmission.find({ materialId });
    return submissions;
  } catch (error) {
    throw error;
  }
};

export const findSubmissionsByUserId = async (userId) => {
  try {
    const submissions = await AssignmentSubmission.find({ userId });
    return submissions;
  } catch (error) {
    throw error;
  }
};
