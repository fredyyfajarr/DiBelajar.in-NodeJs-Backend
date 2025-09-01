import { findUserById } from '../Services/userService.js'; // <-- Impor service

export const loadUser = async (req, res, next) => {
  try {
    const id = req.params.userIdOrSlug || req.params.idOrSlug;

    if (!id) {
      return res.status(400).json({ error: 'User ID or slug is required' });
    }

    // Delegasikan pencarian ke service, bukan query langsung
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.profile = user;
    next();
  } catch (error) {
    next(error);
  }
};
