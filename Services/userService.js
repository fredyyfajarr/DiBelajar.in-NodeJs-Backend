import User from '../Models/User.js';
import bcrypt from 'bcrypt';

export const findAllUsers = async () => {
  try {
    const allUsers = await User.find();
    return allUsers;
  } catch (error) {
    throw error;
  }
};

export const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
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
    throw error;
  }
};
export const updateUser = async (id, updateData) => {
  try {
    // Hashing password baru jika ada di updateData
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const removeUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
  } catch (error) {
    throw error;
  }
};
