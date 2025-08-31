import * as assignmentSubmissionService from '../services/assignmentSubmissionService.js';
import * as userService from '../services/userService.js';
import * as materialService from '../services/materialService.js';
import * as courseService from '../services/courseService.js';

export const createSubmission = async (req, res, next) => {
  try {
    const material = req.material;
    const userId = req.user._id;
    const { submissionFileUrl } = req.body;

    const newSubmission = await assignmentSubmissionService.createSubmission(
      userId,
      material._id,
      submissionFileUrl
    );

    res.status(201).json(newSubmission);
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByMaterialId = async (req, res, next) => {
  try {
    const material = req.material;
    const submissions =
      await assignmentSubmissionService.findSubmissionsByMaterialId(
        material._id
      );
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByUserId = async (req, res, next) => {
  try {
    const { userIdOrSlug } = req.params;
    const user = await userService.findUserById(userIdOrSlug);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const submissions =
      await assignmentSubmissionService.findSubmissionsByUserId(user._id);
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};
