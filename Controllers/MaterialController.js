import * as materialService from '../Services/materialService.js';
import * as courseService from '../Services/courseService.js';

export const getMaterialsByCourseId = async (req, res, next) => {
  try {
    const { courseIdOrSlug } = req.params;
    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const materials = await materialService.findMaterialsByCourseId(course._id);
    res.json(materials);
  } catch (error) {
    next(error);
  }
};

export const getAllMaterials = async (req, res, next) => {
  try {
    const materials = await materialService.findAllMaterials();
    res.json(materials);
  } catch (error) {
    next(error);
  }
};

export const getMaterialById = async (req, res, next) => {
  try {
    const { idOrSlug, courseIdOrSlug } = req.params;
    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const material = await materialService.findMaterialById(
      idOrSlug,
      course._id
    );
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    next(error);
  }
};

export const createMaterial = async (req, res, next) => {
  try {
    const { courseIdOrSlug } = req.params;
    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const newMaterial = await materialService.createMaterial({
      ...req.body,
      courseId: course._id,
    });
    res.status(201).json(newMaterial);
  } catch (error) {
    next(error);
  }
};

export const updateMaterial = async (req, res, next) => {
  try {
    const { idOrSlug, courseIdOrSlug } = req.params;
    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const updatedMaterial = await materialService.updateMaterial(
      idOrSlug,
      course._id,
      req.body
    );
    if (!updatedMaterial) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(updatedMaterial);
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const { idOrSlug, courseIdOrSlug } = req.params;
    const course = await courseService.findCourseById(courseIdOrSlug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const deletedMaterial = await materialService.removeMaterial(
      idOrSlug,
      course._id
    );
    if (!deletedMaterial) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json({
      message: 'Material deleted successfully',
      data: deletedMaterial,
    });
  } catch (error) {
    next(error);
  }
};
