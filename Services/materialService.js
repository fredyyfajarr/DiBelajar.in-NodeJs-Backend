import Material from '../Models/Material.js';

export const findMaterialsByCourseId = async (courseId) => {
  try {
    const materials = await Material.find({ courseId: courseId });
    return materials;
  } catch (error) {
    throw error;
  }
};

export const findAllMaterials = async () => {
  try {
    const materials = await Material.find();
    return materials;
  } catch (error) {
    throw error;
  }
};

export const findMaterialById = async (id, courseId) => {
  try {
    const material = await Material.findOne({ _id: id, courseId: courseId });
    return material;
  } catch (error) {
    throw error;
  }
};

export const createMaterial = async (newMaterialData) => {
  try {
    const newMaterial = await Material.create(newMaterialData);
    return newMaterial;
  } catch (error) {
    throw error;
  }
};

export const updateMaterial = async (id, courseId, updateMaterialData) => {
  try {
    const updatedMaterial = await Material.findOneAndUpdate(
      { _id: id, courseId: courseId },
      updateMaterialData,
      { new: true, runValidators: true }
    );
    return updatedMaterial;
  } catch (error) {
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
    throw error;
  }
};
