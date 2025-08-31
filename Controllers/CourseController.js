import * as courseService from '../services/courseService.js';

export const getAllCourses = async (req, res, next) => {
  try {
    const allCourses = await courseService.findAllCourses();
    res.json(allCourses);
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  // try {
  //   const course = await courseService.findCourseById(req.params.idOrSlug);
  //   if (!course) {
  //     return res.status(404).json({ error: 'Course not found.' });
  //   }
  //   res.json(course);
  // } catch (error) {
  //   next(error);
  // }
  res.json(req.course);
};

export const createCourse = async (req, res, next) => {
  try {
    const newCourse = await courseService.createCourse(req.body);
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
