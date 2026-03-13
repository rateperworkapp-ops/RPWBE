const { Prisma } = require('@prisma/client');
const prisma = require('../config/db');

const parseDateOnly = (value) => new Date(`${value}T00:00:00.000Z`);

const mapWorkEntry = (entry) => ({
  id: entry.id,
  worker_id: entry.worker_id,
  work_date: entry.work_date,
  quantity: Number(entry.quantity),
  rate: Number(entry.rate),
  amount: Number(entry.amount),
  created_at: entry.created_at
});

const createWorkEntry = async ({ worker_id, work_date, quantity }) => {
  const worker = await prisma.worker.findUnique({
    where: { id: worker_id },
    include: {
      department: {
        select: {
          rate: true
        }
      }
    }
  });

  if (!worker) {
    const error = new Error('Worker not found');
    error.statusCode = 404;
    throw error;
  }

  const quantityDecimal = new Prisma.Decimal(quantity);
  const rateDecimal = worker.department.rate;
  const amountDecimal = quantityDecimal.mul(rateDecimal);

  const workEntry = await prisma.workEntry.create({
    data: {
      worker_id,
      work_date: parseDateOnly(work_date),
      quantity: quantityDecimal,
      rate: rateDecimal,
      amount: amountDecimal
    }
  });

  return mapWorkEntry(workEntry);
};

const getWorkEntries = async () => {
  const workEntries = await prisma.workEntry.findMany({
    orderBy: [
      { work_date: 'desc' },
      { created_at: 'desc' }
    ]
  });

  return workEntries.map(mapWorkEntry);
};

const getWorkEntriesByWorkerId = async (workerId) => {
  const workEntries = await prisma.workEntry.findMany({
    where: { worker_id: workerId },
    orderBy: {
      work_date: 'desc'
    }
  });

  return workEntries.map(mapWorkEntry);
};

module.exports = {
  createWorkEntry,
  getWorkEntries,
  getWorkEntriesByWorkerId
};
