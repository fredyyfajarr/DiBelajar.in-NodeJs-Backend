import * as materialService from '../Services/materialService.js';

export const getMaterialsByCourseId = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const materials = await materialService.findMaterialsByCourseId(courseId);
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
    const { id, courseId } = req.params;
    const material = await materialService.findMaterialById(id, courseId);
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
    const { courseId } = req.params;
    const newMaterial = await materialService.createMaterial({
      ...req.body,
      courseId,
    });
    res.status(201).json(newMaterial);
  } catch (error) {
    next(error);
  }
};

export const updateMaterial = async (req, res, next) => {
  try {
    const updatedMaterial = await materialService.updateMaterial(
      req.params.id,
      req.params.courseId,
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
    const deletedMaterial = await materialService.removeMaterial(
      req.params.id,
      req.params.courseId
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
