import mongoose from 'mongoose';
import User from '../models/User.js';

export const loadUser = async (req, res, next) => {
  try {
    const id = req.params.idOrSlug || req.params.userIdOrSlug;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'User ID or slug is required' });
    }

    let user;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id);
    } else {
      user = await User.findOne({ slug: id });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    req.profile = user;
    next();
  } catch (error) {
    next(error);
  }
};
