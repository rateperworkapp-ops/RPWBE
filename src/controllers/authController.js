const bcrypt = require('bcrypt');
const authService = require('../services/authService');
const { generateToken } = require('../utils/jwt');

const MANAGER_ROLE = 'manager';

const formatManager = (manager) => ({
  id: manager.id,
  email: manager.email,
  role: MANAGER_ROLE,
  created_at: manager.created_at
});

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      const error = new Error('Email is already registered');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const manager = await authService.createUser(email, passwordHash);

    return res.status(201).json({
      success: true,
      message: 'Manager registered successfully',
      data: {
        manager: formatManager(manager)
      }
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.getUserByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: MANAGER_ROLE
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        manager: formatManager(user)
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login
};
