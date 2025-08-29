import * as courseService from '../Services/courseService.js';

export const getAllCourses = async (req, res) => {
  try {
    const allCourses = await courseService.findAllCourses();
    res.json(allCourses);
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await courseService.findCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Kursus tidak ditemukan.' });
    }
    res.json(course);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID Kursus tidak valid.' });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const newCourse = await courseService.createCourse(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateCourse = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Kursus ID is required' });
  }
  try {
    const updatedCourse = await courseService.updateCourse(
      req.params.id,
      req.body
    );
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Kursus tidak ditemukan.' });
    }
    res.json(updatedCourse);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID Kursus tidak valid.' });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteCourse = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Kursus ID is required' });
  }
  try {
    const deletedCourse = await courseService.removeCourse(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found.' });
    }
    res.json({ message: 'Kursus berhasil dihapus.', data: deletedCourse });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID Kursus tidak valid.' });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
