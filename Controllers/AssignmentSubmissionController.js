import * as assignmentSubmissionService from '../Services/assignmentSubmissionService.js';

export const createSubmission = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const { userId, submissionFileUrl } = req.body;
    if (!userId || !materialId || !submissionFileUrl)
      return res
        .status(400)
        .json({
          error: 'User ID, Material ID and Submission File URL required',
        });
    const newSubmission = await assignmentSubmissionService.createSubmission(
      userId,
      materialId,
      submissionFileUrl
    );
    res.status(201).json(newSubmission);
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByMaterialId = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const submissions =
      await assignmentSubmissionService.findSubmissionsByMaterialId(materialId);
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const submissions =
      await assignmentSubmissionService.findSubmissionsByUserId(userId);
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};
