import * as userService from '../Services/userService.js';

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
