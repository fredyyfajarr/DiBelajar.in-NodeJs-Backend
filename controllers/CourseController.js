import * as courseService from '../services/courseService.js';
import * as materialService from '../services/materialService.js';
import Course from '../models/Course.js';

export const getAllCourses = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// --- TAMBAHKAN FUNGSI BARU DI SINI ---
export const getCourseAndMaterialsById = async (req, res, next) => {
  try {
    const course = req.course; // Diambil dari middleware loadCourse
    const materials = await materialService.findMaterialsByCourseId(course._id);

    res.status(200).json({
      success: true,
      data: {
        course,
        materials,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getMyCourses = async (req, res, next) => {
  try {
    // Langsung query ke database untuk mencari kursus milik user yang login
    const courses = await Course.find({ instructorId: req.user._id }).populate(
      'instructorId',
      'name'
    );

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
      courseData.thumbnail = `${req.protocol}://${req.get(
        'host'
      )}/public/uploads/thumbnails/${req.file.filename}`;
    } else {
      courseData.thumbnail = `${req.protocol}://${req.get(
        'host'
      )}/public/uploads/default.png`;
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
      updateData.thumbnail = `${req.protocol}://${req.get(
        'host'
      )}/public/uploads/thumbnails/${req.file.filename}`;
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
