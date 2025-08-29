import * as userService from '../Services/userService.js';

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userService.findAllUsers();
    res.json(allUsers);
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }
    res.json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID Pengguna tidak valid.' });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }
    res.json(updatedUser);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID Pengguna tidak valid.' });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    const deletedUser = await userService.removeUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }
    res.json({ message: 'Pengguna berhasil dihapus.', data: deletedUser });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID Pengguna tidak valid.' });
    }
    if (error.message) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
