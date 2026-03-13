const express = require('express');
const { body, param } = require('express-validator');

const payoutController = require('../controllers/payoutController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/generate',
  [
    body('worker_id')
      .notEmpty()
      .withMessage('worker_id is required')
      .isUUID()
      .withMessage('worker_id must be a valid UUID'),
    body('period_type')
      .notEmpty()
      .withMessage('period_type is required')
      .isIn(['weekly', 'monthly'])
      .withMessage('period_type must be weekly or monthly'),
    body('period_start')
      .notEmpty()
      .withMessage('period_start is required')
      .isISO8601()
      .withMessage('period_start must be a valid ISO date'),
    body('period_end')
      .notEmpty()
      .withMessage('period_end is required')
      .isISO8601()
      .withMessage('period_end must be a valid ISO date')
      .custom((periodEnd, { req }) => {
        if (new Date(periodEnd) < new Date(req.body.period_start)) {
          throw new Error('period_end must be greater than or equal to period_start');
        }
        return true;
      })
  ],
  validateRequest,
  payoutController.generatePayout
);

router.get('/', payoutController.getPayouts);

router.get(
  '/:id',
  [
    param('id')
      .isUUID()
      .withMessage('id must be a valid UUID')
  ],
  validateRequest,
  payoutController.getPayoutById
);

router.patch(
  '/:id/pay',
  [
    param('id')
      .isUUID()
      .withMessage('id must be a valid UUID')
  ],
  validateRequest,
  payoutController.payPayout
);

module.exports = router;
