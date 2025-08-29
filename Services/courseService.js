import Course from '../Models/Course.js';

export const findAllCourses = async () => {
  try {
    const allCourses = await Course.find();
    return allCourses;
  } catch (error) {
    throw error;
  }
};

export const findCourseById = async (id) => {
  try {
    const course = await Course.findById(id);
    return course;
  } catch (error) {
    throw error;
  }
};

export const createCourse = async (newCourseData) => {
  try {
    const newCourse = await Course.create(newCourseData);
    return newCourse;
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (id, updatedData) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    return updatedCourse;
  } catch (error) {
    throw error;
  }
};

export const removeCourse = async (id) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    return deletedCourse;
  } catch (error) {
    throw error;
  }
};
