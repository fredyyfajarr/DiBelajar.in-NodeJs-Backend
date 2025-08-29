import Course from '../Models/Course.js';
import validator from 'validator';

export const findAllCourses = async () => {
  try {
    const allCourses = await Course.find();
    return allCourses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const findCourseById = async (id) => {
  try {
    const course = await Course.findById(id);
    return course;
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    throw error;
  }
};

export const createCourse = async (newCourseData) => {
  // Validasi data kursus
  if (!validator.isLength(newCourseData.title, { min: 3, max: 25 })) {
    throw new Error('min 3, max 25 characters');
  }
  if (
    !validator.isAlphanumeric(newCourseData.title, 'en-US', { ignore: ' ' })
  ) {
    throw new Error('Title must contain only letters and numbers');
  }
  if (!validator.isLength(newCourseData.description, { max: 255 })) {
    throw new Error('Description maximum 255 characters');
  }

  try {
    const newCourse = await Course.create(newCourseData);
    return newCourse;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (id, updatedData) => {
  try {
    if (updatedData.title) {
      if (!validator.isLength(updatedData.title, { min: 3, max: 25 })) {
        throw new Error('min 3, max 25 characters');
      }
      if (
        !validator.isAlphanumeric(updatedData.title, 'en-US', { ignore: ' ' })
      ) {
        throw new Error('Title must contain only letters and numbers');
      }
    }

    if (updatedData.description) {
      if (!validator.isLength(updatedData.description, { max: 255 })) {
        throw new Error('Description maximum 255 characters');
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    return updatedCourse;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const removeCourse = async (id) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    return deletedCourse;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};
