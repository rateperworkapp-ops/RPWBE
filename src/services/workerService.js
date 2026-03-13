const prisma = require('../config/db');

const mapWorkerWithDepartment = (worker) => ({
  id: worker.id,
  name: worker.name,
  department_id: worker.department_id,
  created_at: worker.created_at,
  department_name: worker.department.name,
  payment_type: worker.department.payment_type,
  rate: Number(worker.department.rate)
});

const createWorker = async ({ name, department_id }) => {
  const department = await prisma.department.findUnique({
    where: { id: department_id },
    select: { id: true }
  });

  if (!department) {
    const error = new Error('Department not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.worker.create({
    data: {
      name,
      department_id
    },
    select: {
      id: true,
      name: true,
      department_id: true,
      created_at: true
    }
  });
};

const getWorkers = async ({ search, department_id } = {}) => {
  const where = {};

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive'
    };
  }

  if (department_id) {
    where.department_id = department_id;
  }

  const workers = await prisma.worker.findMany({
    where,
    include: {
      department: {
        select: {
          name: true,
          payment_type: true,
          rate: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return workers.map(mapWorkerWithDepartment);
};

const getWorkerById = async (id) => {
  const worker = await prisma.worker.findUnique({
    where: { id },
    include: {
      department: {
        select: {
          name: true,
          payment_type: true,
          rate: true
        }
      }
    }
  });

  return worker ? mapWorkerWithDepartment(worker) : null;
};

const updateWorker = async (id, { name, department_id }) => {
  const worker = await prisma.worker.findUnique({
    where: { id },
    select: { id: true }
  });

  if (!worker) {
    return null;
  }

  const department = await prisma.department.findUnique({
    where: { id: department_id },
    select: { id: true }
  });

  if (!department) {
    const error = new Error('Department not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.worker.update({
    where: { id },
    data: {
      name,
      department_id
    }
  });

  return getWorkerById(id);
};

const deleteWorker = async (id) => {
  try {
    return await prisma.worker.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        department_id: true,
        created_at: true
      }
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return null;
    }
    throw error;
  }
};

module.exports = {
  createWorker,
  getWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker
};
