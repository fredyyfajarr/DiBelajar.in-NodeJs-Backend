import Course from '../Models/Course.js';
import mongoose from 'mongoose';

export const findAllCourses = async () => {
  try {
    const allCourses = await Course.find();
    return allCourses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const findCourseById = async (idOrSlug) => {
  try {
    let course;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      course = await Course.findById(idOrSlug);
    } else {
      course = await Course.findOne({ slug: idOrSlug });
    }
    console.log('Kursus yang ditemukan:', course);
    return course;
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    throw error;
  }
};

export const createCourse = async (newCourseData) => {
  try {
    const newCourse = await Course.create(newCourseData);
    return newCourse;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateCourse = async (idOrSlug, updatedData) => {
  try {
    let courseToUpdate;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      courseToUpdate = await Course.findById(idOrSlug);
    } else {
      courseToUpdate = await Course.findOne({ slug: idOrSlug });
    }

    if (!courseToUpdate) {
      return null;
    }

    Object.assign(courseToUpdate, updatedData);
    const updatedCourse = await courseToUpdate.save();

    return updatedCourse;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const removeCourse = async (idOrSlug) => {
  try {
    let deletedCourse;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      deletedCourse = await Course.findByIdAndDelete(idOrSlug);
    } else {
      deletedCourse = await Course.findOneAndDelete({ slug: idOrSlug });
    }
    return deletedCourse;
  } catch (error) {
    throw error;
  }
};
