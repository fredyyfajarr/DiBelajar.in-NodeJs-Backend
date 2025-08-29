import Enrollment from '../Models/Enrollment.js';

export const findAllEnrollments = async () => {
  try {
    const enrollments = await Enrollment.find();
    return enrollments;
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};
export const findEnrollmentByUserId = async (userId) => {
  try {
    const enrollments = await Enrollment.find({ userId: userId });
    return enrollments;
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

export const findEnrollmentByCourseId = async (courseId) => {
  try {
    const enrollments = await Enrollment.find({ courseId: courseId });
    return enrollments;
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

export const createEnrollment = async (userId, courseId) => {
  const existingEnrollment = await Enrollment.findOne({
    userId: userId,
    courseId: courseId,
  });

  if (existingEnrollment) {
    throw new Error('User already enrolled in this course');
  }

  try {
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
    console.error('Error deleting enrollment:', error);
    throw error;
  }
};
