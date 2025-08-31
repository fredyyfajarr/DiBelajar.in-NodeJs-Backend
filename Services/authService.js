import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Wrong email!');
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) {
      throw new Error('Wrong password!');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h',
      }
    );
    user.password = undefined;
    return { user, token };
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};
