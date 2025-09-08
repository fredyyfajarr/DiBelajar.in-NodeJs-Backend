import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

import Enrollment from '../models/Enrollment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import TestResult from '../models/TestResult.js';
import ForumPost from '../models/ForumPost.js';
import Course from '../models/Course.js';

export const findAllUsers = async () => {
  try {
    const allUsers = await User.find();
    return allUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const findUserById = async (idOrSlug) => {
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      user = await User.findById(idOrSlug);
    } else {
      user = await User.findOne({ slug: idOrSlug });
    }
    return user;
  } catch (error) {
    console.error('Error fetching user by ID or slug:', error);
    throw error;
  }
};

export const createUser = async (newUserData) => {
  try {
    const savedUser = await User.create(newUserData);
    return savedUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
export const updateUser = async (userToUpdate, updateData) => {
  try {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    Object.assign(userToUpdate, updateData);
    const updatedUser = await userToUpdate.save();

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const removeUser = async (userToDelete) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = userToDelete._id;

    if (userToDelete.role === 'instructor') {
      await Course.deleteMany({ instructorId: userId }).session(session);
    }

    await Enrollment.deleteMany({ userId: userId }).session(session);
    await AssignmentSubmission.deleteMany({ userId: userId }).session(session);
    await TestResult.deleteMany({ userId: userId }).session(session);
    await ForumPost.deleteMany({ userId: userId }).session(session);

    await User.findByIdAndDelete(userId).session(session);

    await session.commitTransaction();

    return userToDelete;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error removing user and their data:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

export const getUserPublicProfile = async (user) => {
  // Jika bukan student, kembalikan data dasar
  if (user.role !== 'student') {
    return {
      name: user.name,
      slug: user.slug,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  // Jika student, ambil data kursus yang telah diselesaikan
  const completedCourses = await Enrollment.find({
    userId: user._id,
    completedAt: { $ne: null },
  }).populate({
    path: 'courseId',
    select: 'title slug thumbnail',
  });

  return {
    name: user.name,
    slug: user.slug,
    createdAt: user.createdAt,
    bio: user.bio,
    completedCourses: completedCourses.map((e) => e.courseId),
  };
};
