import { findMaterialById } from '../services/materialService.js';

export const loadMaterial = async (req, res, next) => {
  try {
    // --- LOG UNTUK DEBUGGING FINAL ---
    console.log('\n--- DEBUGGING FINAL: Middleware loadMaterial ---');
    console.log('Seluruh req.params yang diterima:', req.params);
    // --- AKHIR LOG ---

    // Cek semua kemungkinan nama parameter
    const id =
      req.params.materialId ||
      req.params.materialIdOrSlug ||
      req.params.idOrSlug;

    console.log('ID Materi yang berhasil diekstrak:', id); // Kita tambahkan log ini juga

    if (!req.course || !req.course._id) {
      console.error('GAGAL di loadMaterial: req.course tidak ditemukan.');
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
