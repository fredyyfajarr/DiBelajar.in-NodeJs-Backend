import { findCourseById } from '../services/courseService.js'; // <-- Impor service

export const loadCourse = async (req, res, next) => {
  try {
    const id = req.params.courseIdOrSlug || req.params.idOrSlug;

    if (!id) {
      return res.status(400).json({ error: 'Course ID or slug is required' });
    }

    // Delegasikan pencarian ke service, bukan query langsung
    const course = await findCourseById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    req.course = course;
    next();
  } catch (error) {
    next(error);
  }
};
