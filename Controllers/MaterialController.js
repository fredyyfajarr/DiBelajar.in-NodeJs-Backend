import * as materialService from '../Services/materialService.js';

export const getMaterialsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const materials = await materialService.findMaterialsByCourseId(courseId);
    res.json(materials);
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllMaterials = async (req, res) => {
  try {
    const materials = await materialService.findAllMaterials();
    res.json(materials);
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const { id, courseId } = req.params;
    const material = await materialService.findMaterialById(id, courseId);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID Material tidak valid.' });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createMaterial = async (req, res) => {
  try {
    const { courseId } = req.params;
    const newMaterial = await materialService.createMaterial({
      ...req.body,
      courseId,
    });
    res.status(201).json(newMaterial);
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateMaterial = async (req, res) => {
  if (!req.params.id || !req.params.courseId) {
    return res
      .status(400)
      .json({ error: 'Material ID and Course ID are required' });
  }
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
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID Material tidak valid.' });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteMaterial = async (req, res) => {
  if (!req.params.id || !req.params.courseId) {
    return res
      .status(400)
      .json({ error: 'Material ID and Course ID are required' });
  }
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
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID Material tidak valid.' });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
