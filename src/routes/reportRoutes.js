const express = require('express');
const { query } = require('express-validator');

const reportController = require('../controllers/reportController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get(
  '/daily',
  [
    query('date')
      .notEmpty()
      .withMessage('date is required')
      .isISO8601()
      .withMessage('date must be in YYYY-MM-DD format')
  ],
  validateRequest,
  reportController.getDailyReport
);

router.get(
  '/weekly',
  [
    query('startDate')
      .notEmpty()
      .withMessage('startDate is required')
      .isISO8601()
      .withMessage('startDate must be in YYYY-MM-DD format'),
    query('endDate')
      .notEmpty()
      .withMessage('endDate is required')
      .isISO8601()
      .withMessage('endDate must be in YYYY-MM-DD format')
  ],
  validateRequest,
  reportController.getWeeklyReport
);

router.get(
  '/monthly',
  [
    query('month')
      .notEmpty()
      .withMessage('month is required')
      .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
      .withMessage('month must be in YYYY-MM format')
  ],
  validateRequest,
  reportController.getMonthlyReport
);

module.exports = router;
