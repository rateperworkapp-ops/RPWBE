const express = require('express');
const { body, param } = require('express-validator');

const workEntryController = require('../controllers/workEntryController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/',
  [
    body('worker_id')
      .notEmpty()
      .withMessage('worker_id is required')
      .isUUID()
      .withMessage('worker_id must be a valid UUID'),
    body('work_date')
      .notEmpty()
      .withMessage('work_date is required')
      .isISO8601()
      .withMessage('work_date must be a valid ISO date'),
    body('quantity')
      .notEmpty()
      .withMessage('quantity is required')
      .isFloat({ min: 0 })
      .withMessage('quantity must be numeric and greater than or equal to 0')
  ],
  validateRequest,
  workEntryController.createWorkEntry
);

router.get('/', workEntryController.getWorkEntries);

router.get(
  '/worker/:workerId',
  [
    param('workerId')
      .isUUID()
      .withMessage('workerId must be a valid UUID')
  ],
  validateRequest,
  workEntryController.getWorkEntriesByWorkerId
);

module.exports = router;
