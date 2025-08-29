import Material from '../Models/Material.js';
import validator from 'validator';

export const findMaterialsByCourseId = async (courseId) => {
  try {
    const materials = await Material.find({ courseId: courseId });
    return materials;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

export const findAllMaterials = async () => {
  try {
    const materials = await Material.find();
    return materials;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

export const findMaterialById = async (id, courseId) => {
  try {
    const material = await Material.findOne({ _id: id, courseId: courseId });
    return material;
  } catch (error) {
    console.error('Error fetching material by ID:', error);
    throw error;
  }
};

export const createMaterial = async (newMaterialData) => {
  try {
    if (!validator.isLength(newMaterialData.title, { min: 3, max: 25 })) {
      throw new Error('min 3, max 25 characters');
    }
    if (
      !validator.isAlphanumeric(newMaterialData.title, 'en-US', { ignore: ' ' })
    ) {
      throw new Error('Title must contain only letters and numbers');
    }
    if (!validator.isLength(newMaterialData.description, { max: 255 })) {
      throw new Error('Description maximum 255 characters');
    }

    const newMaterial = await Material.create(newMaterialData);
    return newMaterial;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

export const updateMaterial = async (id, courseId, updateMaterialData) => {
  try {
    if (updateMaterialData.title) {
      if (!validator.isLength(updateMaterialData.title, { min: 3, max: 25 })) {
        throw new Error('min 3, max 25 characters');
      }
      if (
        !validator.isAlphanumeric(updateMaterialData.title, 'en-US', {
          ignore: ' ',
        })
      ) {
        throw new Error('Title must contain only letters and numbers');
      }
    }
    if (updateMaterialData.description) {
      if (!validator.isLength(updateMaterialData.description, { max: 255 })) {
        throw new Error('Description maximum 255 characters');
      }
    }

    const updatedMaterial = await Material.findOneAndUpdate(
      { _id: id, courseId: courseId },
      updateMaterialData,
      { new: true, runValidators: true }
    );
    return updatedMaterial;
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

export const removeMaterial = async (id, courseId) => {
  try {
    const deletedMaterial = await Material.findOneAndDelete({
      _id: id,
      courseId: courseId,
    });
    return deletedMaterial;
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};
