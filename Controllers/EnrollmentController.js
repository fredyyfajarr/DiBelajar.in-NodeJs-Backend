import * as enrollmentService from '../Services/enrollmentService.js';

export const findAllEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.findAllEnrollments();
    res.status(200).json(enrollments);
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createEnrollment = async (req, res) => {
  const { userId } = req.params;
  const { courseId } = req.body;
  if (!userId || !courseId) {
    return res.status(400).json({ error: 'Missing userId or courseId' });
  }
  try {
    const newEnrollment = await enrollmentService.createEnrollment(
      userId,
      courseId
    );
    res.status(201).json(newEnrollment);
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const findEnrollmentByUserId = async (req, res) => {
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
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const findEnrollmentByCourseId = async (req, res) => {
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
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removeEnrollment = async (req, res) => {
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
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
