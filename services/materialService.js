import Material from '../models/Material.js';
import mongoose from 'mongoose';
import { buildQuery } from '../utils/queryFeatures.js';

export const findMaterialsByCourseId = async (courseId, options = {}) => {
  try {
    return await buildQuery(Material, { courseId: courseId }, ['courseId']);
    return materials;
  } catch (error) {
    console.error('Error fetching materials by course ID or slug:', error);
    throw error;
  }
};

export const findAllMaterials = async () => {
  try {
    return await buildQuery(Material);
  } catch (error) {
    console.error('Error fetching all materials:', error);
    throw error;
  }
};

export const findMaterialById = async (materialIdOrSlug, courseId) => {
  try {
    let query = { courseId: courseId };
    if (mongoose.Types.ObjectId.isValid(materialIdOrSlug)) {
      query._id = materialIdOrSlug;
    } else {
      query.slug = materialIdOrSlug;
    }
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
    // PERBAIKAN: Hanya update field yang diizinkan untuk mencegah data korup
    const allowedUpdates = ['title', 'description', 'testContent'];

    allowedUpdates.forEach((field) => {
      // Cek apakah data baru menyediakan field ini
      if (updateMaterialData[field] !== undefined) {
        materialToUpdate[field] = updateMaterialData[field];
      }
    });

    // Hapus testContent jika array-nya kosong
    if (
      updateMaterialData.testContent &&
      updateMaterialData.testContent.length === 0
    ) {
      materialToUpdate.testContent = [];
    }

    const updatedMaterial = await materialToUpdate.save();
    return updatedMaterial;
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

export const removeMaterial = async (materialToDelete) => {
  try {
    // Implementasi cascading delete untuk material
    await AssignmentSubmission.deleteMany({ materialId: materialToDelete._id });
    await TestResult.deleteMany({ materialId: materialToDelete._id });
    await ForumPost.deleteMany({ materialId: materialToDelete._id });

    await Material.findByIdAndDelete(materialToDelete._id);
    return materialToDelete;
  } catch (error) {
    console.error('Error removing material:', error);
    throw error;
  }
};
