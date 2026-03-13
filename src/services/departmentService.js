const { Prisma } = require('@prisma/client');
const prisma = require('../config/db');

const mapDepartment = (department) => ({
  id: department.id,
  name: department.name,
  payment_type: department.payment_type,
  rate: Number(department.rate),
  created_at: department.created_at
});

const createDepartment = async ({ name, payment_type, rate }) => {
  const department = await prisma.department.create({
    data: {
      name,
      payment_type,
      rate: new Prisma.Decimal(rate)
    }
  });

  return mapDepartment(department);
};

const getDepartments = async () => {
  const departments = await prisma.department.findMany({
    orderBy: {
      created_at: 'desc'
    }
  });

  return departments.map(mapDepartment);
};

const getDepartmentById = async (id) => {
  const department = await prisma.department.findUnique({
    where: { id }
  });

  return department ? mapDepartment(department) : null;
};

const updateDepartment = async (id, { name, payment_type, rate }) => {
  const department = await prisma.department.findUnique({
    where: { id }
  });

  if (!department) {
    return null;
  }

  const updatedDepartment = await prisma.department.update({
    where: { id },
    data: {
      name,
      payment_type,
      rate: new Prisma.Decimal(rate)
    }
  });

  return mapDepartment(updatedDepartment);
};

const deleteDepartment = async (id) => {
  const department = await prisma.department.findUnique({
    where: { id }
  });

  if (!department) {
    const error = new Error('Department not found');
    error.statusCode = 404;
    throw error;
  }

  const workersCount = await prisma.worker.count({
    where: { department_id: id }
  });

  if (workersCount > 0) {
    const error = new Error('Cannot delete department with existing workers');
    error.statusCode = 400;
    throw error;
  }

  const deletedDepartment = await prisma.department.delete({
    where: { id }
  });

  return mapDepartment(deletedDepartment);
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};
