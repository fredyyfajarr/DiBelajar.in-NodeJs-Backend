import * as assignmentSubmissionService from '../Services/assignmentSubmissionService.js';
import * as userService from '../Services/userService.js';
import * as materialService from '../Services/materialService.js';
import * as courseService from '../Services/courseService.js';

export const createSubmission = async (req, res, next) => {
  try {
    const { materialIdOrSlug, courseIdOrSlug } = req.params;
    const { userIdOrSlug, submissionFileUrl } = req.body;

    const user = await userService.findUserById(userIdOrSlug);
    if (!user) {
      console.log('User not found:', userIdOrSlug);
      return res.status(404).json({ error: 'User not found' });
    }

    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      console.log('Course not found:', courseIdOrSlug);
      return res.status(404).json({ error: 'Course not found' });
    }

    const material = await materialService.findMaterialById(
      materialIdOrSlug,
      course._id
    );
    if (!material) {
      console.log(materialIdOrSlug);
      return res.status(404).json({ error: 'Material not found' });
    }

    const newSubmission = await assignmentSubmissionService.createSubmission(
      user._id,
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
    const { materialIdOrSlug, courseIdOrSlug } = req.params;

    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const material = await materialService.findMaterialById(
      materialIdOrSlug,
      course._id
    );
    if (!material) {
      console.log('Material not found:', materialIdOrSlug);
      return res.status(404).json({ error: 'Material not found' });
    }

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
