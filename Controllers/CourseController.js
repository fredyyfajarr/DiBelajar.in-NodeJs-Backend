import * as courseService from '../Services/courseService.js';

export const getAllCourses = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

export const getCourseById = async (req, res, next) => {
  res.json(req.course);
};

export const createCourse = async (req, res, next) => {
  try {
    const courseData = { ...req.body };
    if (req.file) {
      const thumbnailUrl = `${req.protocol}://${req.get(
        'host'
      )}/uploads/thumbnails/${req.file.filename}`;
      courseData.thumbnail = thumbnailUrl;
    } else {
      courseData.thumbnail = `${req.protocol}://${req.get(
        'host'
      )}/uploads/default.png`;
    }
    courseData.instructorId = req.user._id;
    const newCourse = await courseService.createCourse(courseData);
    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const updatedCourse = await courseService.updateCourse(
      req.course,
      req.body
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
