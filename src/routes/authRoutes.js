const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/register',
  [
    body('email')
      .exists({ checkFalsy: true })
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email must be valid')
      .normalizeEmail(),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  authController.register
);

router.post(
  '/login',
  [
    body('email')
      .exists({ checkFalsy: true })
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email must be valid')
      .normalizeEmail(),
    body('password')
      .exists({ checkFalsy: true })
      .withMessage('Password is required')
  ],
  validateRequest,
  authController.login
);

module.exports = router;
