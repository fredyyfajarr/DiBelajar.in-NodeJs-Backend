import mongoose from 'mongoose';
import Course from '../models/Course.js';

export const loadCourse = async (req, res, next) => {
  try {
    const id = req.params.courseIdOrSlug || req.params.idOrSlug;

    if (!id) {
      return res.status(400).json({ error: 'Course ID or slug is required' });
    }

    let course;
    if (mongoose.Types.ObjectId.isValid(id)) {
      course = await Course.findById(id);
    } else {
      course = await Course.findOne({ slug: id });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    req.course = course;
    next();
  } catch (error) {
    next(error);
  }
};
