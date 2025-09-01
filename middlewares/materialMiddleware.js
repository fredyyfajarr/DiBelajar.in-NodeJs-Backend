import { findMaterialById } from '../services/materialService.js'; // <-- Impor service

export const loadMaterial = async (req, res, next) => {
  try {
    const id = req.params.materialIdOrSlug || req.params.idOrSlug;
    const courseId = req.course._id;
    if (!id) {
      return res.status(400).json({ error: 'Material ID or slug is required' });
    }

    // Delegasikan pencarian ke service, bukan query langsung
    const material = await findMaterialById(id, courseId);

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    req.material = material;
    next();
  } catch (error) {
    next(error);
  }
};
