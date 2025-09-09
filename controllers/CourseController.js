import * as courseService from '../services/courseService.js';
import * as materialService from '../services/materialService.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

export const getAllCourses = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

export const getCourseAndMaterialsById = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const courseDetails = await courseService.getCourseDetails(
      req.course._id,
      userId
    );

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    next(error); // <-- Disederhanakan
  }
};

export const getMyCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getCoursesByInstructor(req.user._id);
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  res.json(req.course);
};

export const createCourse = async (req, res, next) => {
  try {
    const courseData = { ...req.body };
    // courseData.instructorId = req.user._id;
    courseData.instructorId = req.body.instructorId || req.user._id;
    if (req.file) {
      courseData.thumbnail = req.file.path;
    } else {
      courseData.thumbnail = `https://placehold.co/600x400/7c3aed/white?text=DiBelajar.in`;
    }
    // courseData.instructorId = req.user._id;
    const newCourse = await courseService.createCourse(courseData);
    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.thumbnail = req.file.path;
    }

    const updatedCourse = await courseService.updateCourse(
      req.course,
      updateData
    );
    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const deletedCourse = await courseService.removeCourse(req.course);
    res.json({ message: 'Course deleted successfully.', data: deletedCourse });
  } catch (error) {
    next(error);
  }
};
