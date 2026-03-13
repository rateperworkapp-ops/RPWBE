const prisma = require('../config/db');

const parseDateOnly = (value) => new Date(`${value}T00:00:00.000Z`);

const buildMonthlyRange = (month) => {
  const [year, monthNumber] = month.split('-').map(Number);
  const periodStart = parseDateOnly(`${month}-01`);
  const periodEnd = new Date(Date.UTC(year, monthNumber, 0));

  return { periodStart, periodEnd };
};

const buildPerWorker = (entries, payoutByWorkerId = new Map()) => {
  const grouped = new Map();

  for (const entry of entries) {
    const key = entry.worker_id;
    if (!grouped.has(key)) {
      const payout = payoutByWorkerId.get(key) || null;
      grouped.set(key, {
        worker_id: entry.worker_id,
        worker_name: entry.worker.name,
        department_name: entry.worker.department.name,
        total_quantity: 0,
        total_amount: 0,
        payout_status_for_range: payout ? payout.status : null,
        payout_id_for_range: payout ? payout.id : null
      });
    }

    const current = grouped.get(key);
    current.total_quantity += Number(entry.quantity);
    current.total_amount += Number(entry.amount);
  }

  return Array.from(grouped.values())
    .map((workerRow) => ({
      ...workerRow,
      total_quantity: Number(workerRow.total_quantity.toFixed(2)),
      total_amount: Number(workerRow.total_amount.toFixed(2))
    }))
    .sort((a, b) => a.worker_name.localeCompare(b.worker_name));
};

const getTotalsFromEntries = (entries) => {
  let totalQuantity = 0;
  let totalAmount = 0;

  for (const entry of entries) {
    totalQuantity += Number(entry.quantity);
    totalAmount += Number(entry.amount);
  }

  return {
    total_quantity: Number(totalQuantity.toFixed(2)),
    total_amount: Number(totalAmount.toFixed(2))
  };
};

const getDailyReport = async (date) => {
  const targetDate = parseDateOnly(date);

  const entries = await prisma.workEntry.findMany({
    where: {
      work_date: targetDate
    },
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

  const totals = getTotalsFromEntries(entries);
  const perWorker = buildPerWorker(entries);

  return {
    date,
    total_quantity: totals.total_quantity,
    total_amount: totals.total_amount,
    entries_count: entries.length,
    per_worker: perWorker.map((row) => ({
      worker_id: row.worker_id,
      worker_name: row.worker_name,
      department_name: row.department_name,
      total_quantity: row.total_quantity,
      total_amount: row.total_amount
    }))
  };
};

const getWeeklyReport = async (startDate, endDate) => {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  const [entries, payouts] = await Promise.all([
    prisma.workEntry.findMany({
      where: {
        work_date: {
          gte: start,
          lte: end
        }
      },
      include: {
        worker: {
          include: {
            department: {
              select: { name: true }
            }
          }
        }
      }
    }),
    prisma.salaryPayout.findMany({
      where: {
        period_type: 'weekly',
        period_start: start,
        period_end: end
      },
      select: {
        id: true,
        worker_id: true,
        status: true
      }
    })
  ]);

  const payoutByWorkerId = new Map(payouts.map((payout) => [payout.worker_id, payout]));
  const totals = getTotalsFromEntries(entries);
  const perWorker = buildPerWorker(entries, payoutByWorkerId);

  return {
    startDate,
    endDate,
    total_quantity: totals.total_quantity,
    total_amount: totals.total_amount,
    per_worker: perWorker
  };
};

const getMonthlyReport = async (month) => {
  const { periodStart, periodEnd } = buildMonthlyRange(month);

  const [entries, payouts] = await Promise.all([
    prisma.workEntry.findMany({
      where: {
        work_date: {
          gte: periodStart,
          lte: periodEnd
        }
      },
      include: {
        worker: {
          include: {
            department: {
              select: { name: true }
            }
          }
        }
      }
    }),
    prisma.salaryPayout.findMany({
      where: {
        period_type: 'monthly',
        period_start: periodStart,
        period_end: periodEnd
      },
      select: {
        id: true,
        worker_id: true,
        status: true
      }
    })
  ]);

  const payoutByWorkerId = new Map(payouts.map((payout) => [payout.worker_id, payout]));
  const totals = getTotalsFromEntries(entries);
  const perWorker = buildPerWorker(entries, payoutByWorkerId);

  return {
    month,
    total_quantity: totals.total_quantity,
    total_amount: totals.total_amount,
    per_worker: perWorker
  };
};

module.exports = {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport
};
