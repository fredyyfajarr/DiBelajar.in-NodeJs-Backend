import * as enrollmentService from '../services/enrollmentService.js';

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
    const enrollments = await enrollmentService.findEnrollmentByUserId(
      req.profile._id,
      req.query
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
    const enrollments = await enrollmentService.findEnrollmentByCourseId(
      req.course._id,
      req.query
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
