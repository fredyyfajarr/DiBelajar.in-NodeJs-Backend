import Enrollment from '../Models/Enrollment.js';

export const findAllEnrollments = async () => {
  try {
    const enrollments = await Enrollment.find();
    return enrollments;
  } catch (error) {
    throw error;
  }
};
export const findEnrollmentByUserId = async (userId) => {
  try {
    const enrollments = await Enrollment.find({ userId: userId });
    return enrollments;
  } catch (error) {
    throw error;
  }
};

export const findEnrollmentByCourseId = async (courseId) => {
  try {
    const enrollments = await Enrollment.find({ courseId: courseId });
    return enrollments;
  } catch (error) {
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
    throw error;
  }
};
