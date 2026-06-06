import * as materialService from '../services/materialService.js';

export const getMaterialsByCourseId = async (req, res, next) => {
  try {
    const materials = await materialService.findMaterialsByCourseId(
      req.course._id,
      req.query
    );

    res.json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMaterials = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

export const getMaterialById = async (req, res, next) => {
  try {
    if (req.material) {
      return res.json(req.material);
    }

    const material = await materialService.findMaterialByIdOrSlug(
      req.params.idOrSlug
    );

    if (!material) {
      const error = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }

    return res.json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};

export const createMaterial = async (req, res, next) => {
  try {
    const course = req.course;
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
    const updatedMaterial = await materialService.updateMaterial(
      req.material,
      req.body
    );
    res.json(updatedMaterial);
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const deletedMaterial = await materialService.removeMaterial(req.material);

    res.json({
      message: 'Material deleted successfully',
      data: deletedMaterial,
    });
  } catch (error) {
    next(error);
  }
};
