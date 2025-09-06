import * as userService from '../services/userService.js';
import Enrollment from '../models/Enrollment.js';

export const getAllUsers = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

export const getUserById = async (req, res, next) => {
  res.json(req.profile);
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.profile, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await userService.removeUser(req.profile);

    res.json({ message: 'User deleted successfully.', data: deletedUser });
  } catch (error) {
    next(error);
  }
};

// --- TAMBAHKAN FUNGSI BARU INI ---
export const getUserProfile = async (req, res, next) => {
  try {
    const user = req.profile; // Diambil dari middleware loadUser

    // Hanya tampilkan profil lengkap jika user adalah 'student'
    if (user.role !== 'student') {
      return res.status(200).json({
        success: true,
        data: {
          name: user.name,
          slug: user.slug,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    }

    // Ambil data kursus yang telah diselesaikan oleh siswa
    const completedCourses = await Enrollment.find({
      userId: user._id,
      completedAt: { $ne: null },
    }).populate({
      path: 'courseId',
      select: 'title slug thumbnail',
    });

    // Kirim hanya data yang bersifat publik
    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        slug: user.slug,
        createdAt: user.createdAt,
        bio: user.bio,
        completedCourses: completedCourses.map((e) => e.courseId),
      },
    });
  } catch (error) {
    next(error);
  }
};
