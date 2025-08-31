import * as enrollmentService from '../services/enrollmentService.js';
import * as userService from '../services/userService.js';
import * as courseService from '../services/courseService.js';

export const findAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.findAllEnrollments();
    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};

export const createEnrollment = async (req, res, next) => {
  try {
    const { userIdOrSlug } = req.params;
    const { courseIdOrSlug } = req.body;

    const user = await userService.findUserById(userIdOrSlug);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const newEnrollment = await enrollmentService.createEnrollment(
      user._id,
      course._id
    );
    res.status(201).json(newEnrollment);
  } catch (error) {
    next(error);
  }
};

export const findEnrollmentByUserId = async (req, res, next) => {
  try {
    const { userIdOrSlug } = req.params;
    const user = await userService.findUserById(userIdOrSlug);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const enrollments = await enrollmentService.findEnrollmentByUserId(
      user._id
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
    const { courseIdOrSlug } = req.params;
    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const enrollments = await enrollmentService.findEnrollmentByCourseId(
      course._id
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
    const { userIdOrSlug, courseIdOrSlug } = req.params;
    const user = await userService.findUserById(userIdOrSlug);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
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
