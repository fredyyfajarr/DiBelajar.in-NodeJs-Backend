import * as materialService from '../services/materialService.js';
import Material from '../models/Material.js';

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
  res.json(req.material);
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
