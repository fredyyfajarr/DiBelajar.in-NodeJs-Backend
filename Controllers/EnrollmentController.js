import * as enrollmentService from '../Services/enrollmentService.js';

export const findAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.findAllEnrollments();
    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};

export const createEnrollment = async (req, res, next) => {
  const { userId } = req.params;
  const { courseId } = req.body;

  if (!userId || !courseId)
    return res.status(400).json({ error: 'User ID and Course ID required' });

  try {
    const newEnrollment = await enrollmentService.createEnrollment(
      userId,
      courseId
    );
    res.status(201).json(newEnrollment);
  } catch (error) {
    next(error);
  }
};

export const findEnrollmentByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const enrollments = await enrollmentService.findEnrollmentByUserId(userId);
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
    const { courseId } = req.params;
    const enrollments = await enrollmentService.findEnrollmentByCourseId(
      courseId
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
    const { userId, courseId } = req.params;
    const deletedEnrollment = await enrollmentService.removeEnrollment(
      userId,
      courseId
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
