import Enrollment from '../models/Enrollment.js';
import { buildQuery } from '../utils/queryFeatures.js';

export const findAllEnrollments = async () => {
  try {
    return await buildQuery(Enrollment, {}, [
      { path: 'userId', select: 'name email' },
      { path: 'courseId', select: 'title description' },
    ]);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};
export const findEnrollmentByUserId = async (userId, options = {}) => {
  try {
    return await buildQuery(Enrollment, options, { userId }, [
      {
        path: 'userId',
        select: 'name email',
      },
      { path: 'courseId', select: 'title description' },
    ]);
  } catch (error) {
    console.error('Error fetching enrollments by user ID:', error);
    throw error;
  }
};

export const findEnrollmentByCourseId = async (courseId, options = {}) => {
  try {
    return await buildQuery(Enrollment, options, { courseId }, [
      {
        path: 'userId',
        select: 'name email',
      },
      { path: 'courseId', select: 'title description' },
    ]);
  } catch (error) {
    console.error('Error fetching enrollments by course ID:', error);
    throw error;
  }
};

export const createEnrollment = async (userId, courseId) => {
  try {
    const existingEnrollment = await Enrollment.findOne({
      userId: userId,
      courseId: courseId,
    });

    if (existingEnrollment) {
      throw new Error('User already enrolled in this course');
    }

    const newEnrollment = await Enrollment.create({ userId, courseId });
    return newEnrollment;
  } catch (error) {
    console.error('Error creating enrollment:', error);
    throw error;
  }
};

export const removeEnrollment = async (userId, courseId) => {
  try {
    const deletedEnrollment = await Enrollment.findOneAndDelete({
      userId: userId,
      courseId: courseId,
    });
    return deletedEnrollment;
  } catch (error) {
    console.error('Error removing enrollment:', error);
    throw error;
  }
};
