import * as userService from '../services/userService.js';
import * as authService from '../services/authService.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res
      .status(200)
      .json({ success: true, token: 'Bearer ' + token, data: user });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await userService.createUser({
      name,
      email,
      password,
      role: 'student',
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    newUser.password = undefined;

    res.status(201).json({
      success: true,
      message: 'User Registered Successfully',
      token: 'Bearer ' + token,
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: 'User logged out successfully' });
};
