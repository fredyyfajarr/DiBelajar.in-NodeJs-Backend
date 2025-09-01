import * as assignmentSubmissionService from '../services/assignmentSubmissionService.js';
import {
  getPaginationOptions,
  getSortOptions,
} from '../utils/queryFeatures.js';
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
    const options = {
      ...getPaginationOptions(req.query),
      sort: getSortOptions(req.query),
    };
    const submissions =
      await assignmentSubmissionService.findSubmissionsByMaterialId(
        material._id,
        options
      );
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsByUserId = async (req, res, next) => {
  try {
    const user = req.profile;
    const options = {
      ...getPaginationOptions(req.query),
      sort: getSortOptions(req.query),
    };
    const submissions =
      await assignmentSubmissionService.findSubmissionsByUserId(
        user._id,
        options
      );
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};
