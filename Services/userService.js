import User from '../models/User.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

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
    // Hashing password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUserData.password, salt);

    const user = new User({ ...newUserData, password: hashedPassword });
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
export const updateUser = async (userToUpdate, updateData) => {
  try {
    // Hashing password baru jika ada di updateData
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
  try {
    await User.findByIdAndDelete(userToDelete._id);
    return userToDelete;
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
};
