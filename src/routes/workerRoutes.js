const express = require('express');
const { body, param } = require('express-validator');

const workerController = require('../controllers/workerController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const idValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID')
];

const workerBodyValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name is required')
    .isLength({ max: 100 })
    .withMessage('name must be at most 100 characters'),
  body('department_id')
    .notEmpty()
    .withMessage('department_id is required')
    .isUUID()
    .withMessage('department_id must be a valid UUID')
];

router.post('/', workerBodyValidators, validateRequest, workerController.createWorker);
router.get('/', workerController.getWorkers);
router.get('/:id', idValidator, validateRequest, workerController.getWorkerById);
router.put('/:id', [...idValidator, ...workerBodyValidators], validateRequest, workerController.updateWorker);
router.delete('/:id', idValidator, validateRequest, workerController.deleteWorker);

module.exports = router;
