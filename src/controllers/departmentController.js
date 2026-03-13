const departmentService = require('../services/departmentService');

const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.body);

    return res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    return next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const departments = await departmentService.getDepartments();

    return res.status(200).json({
      success: true,
      message: 'Departments fetched successfully',
      data: departments
    });
  } catch (error) {
    return next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);

    if (!department) {
      const error = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Department fetched successfully',
      data: department
    });
  } catch (error) {
    return next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);

    if (!department) {
      const error = new Error('Department not found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department
    });
  } catch (error) {
    return next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.deleteDepartment(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
      data: department
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};
