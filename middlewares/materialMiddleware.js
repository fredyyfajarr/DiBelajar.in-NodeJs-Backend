import mongoose from 'mongoose';
import Material from '../models/Material.js';

export const loadMaterial = async (req, res, next) => {
  try {
    const courseId = req.course._id;
    const { materialIdOrSlug } = req.params;

    if (!materialIdOrSlug) {
      return res.status(400).json({ error: 'Material ID or slug is required' });
    }

    let material;
    const query = { courseId: courseId };
    if (mongoose.Types.ObjectId.isValid(materialIdOrSlug)) {
      query._id = materialIdOrSlug;
    } else {
      query.slug = materialIdOrSlug;
    }

    material = await Material.findOne(query);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    req.material = material;
    next();
  } catch (error) {
    next(error);
  }
};
