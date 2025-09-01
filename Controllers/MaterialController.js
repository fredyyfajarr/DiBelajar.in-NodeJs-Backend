import * as materialService from '../services/materialService.js';
import {
  getPaginationOptions,
  getSortOptions,
} from '../utils/queryFeatures.js';
import Material from '../models/Material.js';

export const getMaterialsByCourseId = async (req, res, next) => {
  try {
    const course = req.course;
    const options = {
      ...getPaginationOptions(req.query),
      sort: getSortOptions(req.query),
    };

    const materials = await materialService.findMaterialsByCourseId(
      course._id,
      options
    );

    const totalMaterials = await Material.countDocuments({
      courseId: course._id,
    });

    res.json({
      success: true,
      count: materials.length,
      total: totalMaterials,
      pagination: {
        page: options.skip / options.limit + 1,
        limit: options.limit,
      },
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
