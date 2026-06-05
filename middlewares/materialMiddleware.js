import { findMaterialById } from '../services/materialService.js';

export const loadMaterial = async (req, res, next) => {
  try {
    // Cek semua kemungkinan nama parameter
    const id =
      req.params.materialId ||
      req.params.materialIdOrSlug ||
      req.params.idOrSlug;

    if (!req.course || !req.course._id) {
      return res
        .status(500)
        .json({ error: 'Server error: Course context missing.' });
    }

    const courseId = req.course._id;

    if (!id) {
      return res.status(400).json({ error: 'Material ID or slug is required' });
    }

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
