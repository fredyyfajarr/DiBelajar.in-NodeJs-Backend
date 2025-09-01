import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Material from '../models/Material.js';
import Enrollment from '../models/Enrollment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import TestResult from '../models/TestResult.js';
import ForumPost from '../models/ForumPost.js';

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

export const updateCourse = async (courseToUpdate, updatedData) => {
  try {
    Object.assign(courseToUpdate, updatedData);
    const updatedCourse = await courseToUpdate.save();

    return updatedCourse;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const removeCourse = async (courseToDelete) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const courseId = courseToDelete._id;
    const materialsInCourse = await Material.find({
      courseId: courseId,
    }).session(session);
    const materialIds = materialsInCourse.map((m) => m._id);
    if (materialIds.length > 0) {
      await AssignmentSubmission.deleteMany({
        materialId: { $in: materialIds },
      }).session(session);
      await TestResult.deleteMany({ materialId: { $in: materialIds } }).session(
        session
      );
      await ForumPost.deleteMany({ materialId: { $in: materialIds } }).session(
        session
      );
    }
    await Material.deleteMany({ courseId: courseId }).session(session);
    await Enrollment.deleteMany({ courseId: courseId }).session(session);
    await Course.findByIdAndDelete(courseId).session(session);
    await session.commitTransaction();
    return courseToDelete;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error removing course and its dependencies:', error);
    throw error;
  } finally {
    session.endSession();
  }
};
