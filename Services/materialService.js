import Material from '../models/Material.js';
import mongoose from 'mongoose';

const getMaterialQuery = (materialIdOrSlug, courseIdOrSlug) => {
  let query = { courseId: courseIdOrSlug };
  if (mongoose.Types.ObjectId.isValid(materialIdOrSlug)) {
    query._id = materialIdOrSlug;
  } else {
    query.slug = materialIdOrSlug;
  }
  return query;
};

const getAllMaterialsByCourseQuery = (courseId) => {
  return { courseId: courseId };
};

export const findMaterialsByCourseId = async (courseId) => {
  try {
    const query = getAllMaterialsByCourseQuery(courseId);
    const materials = await Material.find(query);
    return materials;
  } catch (error) {
    console.error('Error fetching materials by course ID or slug:', error);
    throw error;
  }
};

export const findAllMaterials = async () => {
  try {
    const materials = await Material.find();
    return materials;
  } catch (error) {
    console.error('Error fetching all materials:', error);
    throw error;
  }
};

export const findMaterialById = async (materialIdOrSlug, courseId) => {
  try {
    const query = getMaterialQuery(materialIdOrSlug, courseId);
    const material = await Material.findOne(query);
    return material;
  } catch (error) {
    console.error('Error fetching material by ID or slug:', error);
    throw error;
  }
};
export const createMaterial = async (newMaterialData) => {
  try {
    const newMaterial = await Material.create(newMaterialData);
    return newMaterial;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

export const updateMaterial = async (materialToUpdate, updateMaterialData) => {
  try {
    Object.assign(materialToUpdate, updateMaterialData);
    const updatedMaterial = await materialToUpdate.save();
    return updatedMaterial;
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

export const removeMaterial = async (materialToDelete) => {
  try {
    await Material.findOneAndDelete(materialToDelete._id);
    return materialToDelete;
  } catch (error) {
    console.error('Error removing material:', error);
    throw error;
  }
};
