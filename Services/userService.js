import User from '../Models/User.js';
import validator from 'validator';
import bcrypt from 'bcrypt';

export const findAllUsers = async () => {
  try {
    const allUsers = await User.find();
    return allUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

export const createUser = async (newUserData) => {
  try {
    // Validasi Nama
    if (!validator.isLength(newUserData.name, { min: 3, max: 50 })) {
      throw new Error('Name must be at least 3 characters');
    }

    // Validasi Email
    if (!validator.isEmail(newUserData.email)) {
      throw new Error('Invalid email format');
    }

    // Validasi Password
    if (newUserData.password) {
      if (!validator.isStrongPassword(newUserData.password)) {
        throw new Error('Password is not strong enough');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newUserData.password, salt);

      newUserData.password = hashedPassword;
    }

    const newUser = new User({ ...newUserData });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

export const updateUser = async (id, updateData) => {
  try {
    // validasi nama
    if (updateData.name) {
      if (!validator.isLength(updateData.name, { min: 3 })) {
      }
      throw new Error('Name must be at least 3 characters');
    }

    // validasi email
    if (updateData.email) {
      if (!validator.isEmail(updateData.email)) {
        throw new Error('Invalid email format');
      }
    }

    // validasi password
    if (updateData.password) {
      if (!validator.isStrongPassword(updateData.password)) {
        throw new Error('Password is not strong enough');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateData.password, salt);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((val) => val.message);
      throw new Error(message.join(', '));
    }
    throw error;
  }
};

export const removeUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
