const express = require('express');
const { body, param } = require('express-validator');

const departmentController = require('../controllers/departmentController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const idValidator = [
  param('id')
    .isUUID()
    .withMessage('id must be a valid UUID')
];

const departmentBodyValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name is required')
    .isLength({ max: 100 })
    .withMessage('name must be at most 100 characters'),
  body('payment_type')
    .notEmpty()
    .withMessage('payment_type is required')
    .isIn(['kg', 'piece'])
    .withMessage('payment_type must be kg or piece'),
  body('rate')
    .notEmpty()
    .withMessage('rate is required')
    .isFloat({ min: 0 })
    .withMessage('rate must be a number greater than or equal to 0')
];

router.post('/', departmentBodyValidators, validateRequest, departmentController.createDepartment);
router.get('/', departmentController.getDepartments);
router.get('/:id', idValidator, validateRequest, departmentController.getDepartmentById);
router.put('/:id', [...idValidator, ...departmentBodyValidators], validateRequest, departmentController.updateDepartment);
router.delete('/:id', idValidator, validateRequest, departmentController.deleteDepartment);

module.exports = router;
