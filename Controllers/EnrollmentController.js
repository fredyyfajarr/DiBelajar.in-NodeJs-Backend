import * as enrollmentService from '../Services/enrollmentService.js';
import {
  getPaginationOptions,
  getSortOptions,
} from '../utils/queryFeatures.js';

export const enrollInCourse = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const courseId = req.course._id;

    const newEnrollment = await enrollmentService.createEnrollment(
      userId,
      courseId
    );
    res.status(201).json(newEnrollment);
  } catch (error) {
    next(error);
  }
};

export const findAllEnrollments = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

export const findEnrollmentByUserId = async (req, res, next) => {
  try {
    const user = req.profile;
    const options = {
      ...getPaginationOptions(req.query),
      sort: getSortOptions(req.query),
    };
    const enrollments = await enrollmentService.findEnrollmentByUserId(
      user._id,
      options
    );
    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ error: 'No enrollments found for this user' });
    }
    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};

export const findEnrollmentByCourseId = async (req, res, next) => {
  try {
    const course = req.course;
    const options = {
      ...getPaginationOptions(req.query),
      sort: getSortOptions(req.query),
    };
    const enrollments = await enrollmentService.findEnrollmentByCourseId(
      course._id,
      options
    );
    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ error: 'No enrollments found for this course' });
    }
    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};

export const removeEnrollment = async (req, res, next) => {
  try {
    const user = req.profile;
    const course = req.course;
    const deletedEnrollment = await enrollmentService.removeEnrollment(
      user._id,
      course._id
    );
    if (!deletedEnrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.status(200).json({
      message: 'Enrollment deleted successfully',
      data: deletedEnrollment,
    });
  } catch (error) {
    next(error);
  }
};
