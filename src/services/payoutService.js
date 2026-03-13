const { Prisma } = require('@prisma/client');
const prisma = require('../config/db');

const parseDateOnly = (value) => new Date(`${value}T00:00:00.000Z`);

const mapPayoutWithDetails = (payout) => ({
  id: payout.id,
  worker_id: payout.worker.id,
  worker_name: payout.worker.name,
  department_name: payout.worker.department.name,
  period_type: payout.period_type,
  period_start: payout.period_start,
  period_end: payout.period_end,
  total_quantity: Number(payout.total_quantity),
  total_amount: Number(payout.total_amount),
  status: payout.status,
  paid_at: payout.paid_at,
  created_at: payout.created_at
});

const getPayoutByIdWithDetails = async (id) => {
  const payout = await prisma.salaryPayout.findUnique({
    where: { id },
    include: {
      worker: {
        include: {
          department: {
            select: { name: true }
          }
        }
      }
    }
  });

  return payout ? mapPayoutWithDetails(payout) : null;
};

const generatePayout = async ({ worker_id, period_type, period_start, period_end }) => {
  const startDate = parseDateOnly(period_start);
  const endDate = parseDateOnly(period_end);

  if (startDate > endDate) {
    const error = new Error('period_start must be less than or equal to period_end');
    error.statusCode = 400;
    throw error;
  }

  const worker = await prisma.worker.findUnique({
    where: { id: worker_id },
    select: { id: true }
  });

  if (!worker) {
    const error = new Error('Worker not found');
    error.statusCode = 404;
    throw error;
  }

  const workEntries = await prisma.workEntry.findMany({
    where: {
      worker_id,
      work_date: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      quantity: true,
      amount: true
    }
  });

  if (workEntries.length === 0) {
    const error = new Error('No work entries found for the selected date range');
    error.statusCode = 400;
    throw error;
  }

  const totalQuantity = workEntries.reduce(
    (sum, entry) => sum.plus(entry.quantity),
    new Prisma.Decimal(0)
  );
  const totalAmount = workEntries.reduce(
    (sum, entry) => sum.plus(entry.amount),
    new Prisma.Decimal(0)
  );

  try {
    const payout = await prisma.salaryPayout.create({
      data: {
        worker_id,
        period_type,
        period_start: startDate,
        period_end: endDate,
        total_quantity: totalQuantity,
        total_amount: totalAmount,
        status: 'pending'
      }
    });

    return getPayoutByIdWithDetails(payout.id);
  } catch (error) {
    if (error.code === 'P2002') {
      const duplicateError = new Error('Payout already exists for this worker and date range');
      duplicateError.statusCode = 400;
      throw duplicateError;
    }
    throw error;
  }
};

const getPayouts = async () => {
  const payouts = await prisma.salaryPayout.findMany({
    include: {
      worker: {
        include: {
          department: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return payouts.map(mapPayoutWithDetails);
};

const getPayoutById = async (id) => getPayoutByIdWithDetails(id);

const payPayout = async (id) => {
  const payout = await prisma.salaryPayout.findUnique({
    where: { id },
    select: {
      id: true,
      status: true
    }
  });

  if (!payout) {
    const error = new Error('Payout not found');
    error.statusCode = 404;
    throw error;
  }

  if (payout.status === 'paid') {
    const error = new Error('Payout is already paid');
    error.statusCode = 400;
    throw error;
  }

  await prisma.salaryPayout.update({
    where: { id },
    data: {
      status: 'paid',
      paid_at: new Date()
    }
  });

  return getPayoutByIdWithDetails(id);
};

module.exports = {
  generatePayout,
  getPayouts,
  getPayoutById,
  payPayout
};
