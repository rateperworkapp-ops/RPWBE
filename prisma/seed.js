const bcrypt = require('bcrypt');
const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

const toDate = (value) => new Date(`${value}T00:00:00.000Z`);

async function main() {
  await prisma.salaryPayout.deleteMany();
  await prisma.workEntry.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  const managerPasswordHash = await bcrypt.hash('manager123', 10);

  await prisma.user.create({
    data: {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'manager@factory.com',
      password_hash: managerPasswordHash
    }
  });

  await prisma.department.createMany({
    data: [
      {
        id: '22222222-2222-2222-2222-222222222221',
        name: 'Packing',
        payment_type: 'piece',
        rate: new Prisma.Decimal('2.50')
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Weighing',
        payment_type: 'kg',
        rate: new Prisma.Decimal('1.80')
      },
      {
        id: '22222222-2222-2222-2222-222222222223',
        name: 'Assembly',
        payment_type: 'piece',
        rate: new Prisma.Decimal('3.20')
      }
    ]
  });

  await prisma.worker.createMany({
    data: [
      {
        id: '33333333-3333-3333-3333-333333333331',
        name: 'Ravi Kumar',
        department_id: '22222222-2222-2222-2222-222222222221'
      },
      {
        id: '33333333-3333-3333-3333-333333333332',
        name: 'Aisha Khan',
        department_id: '22222222-2222-2222-2222-222222222221'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'Manoj Singh',
        department_id: '22222222-2222-2222-2222-222222222222'
      },
      {
        id: '33333333-3333-3333-3333-333333333334',
        name: 'Priya Patel',
        department_id: '22222222-2222-2222-2222-222222222222'
      },
      {
        id: '33333333-3333-3333-3333-333333333335',
        name: 'Suresh Das',
        department_id: '22222222-2222-2222-2222-222222222223'
      }
    ]
  });

  await prisma.workEntry.createMany({
    data: [
      {
        id: '44444444-4444-4444-4444-444444444401',
        worker_id: '33333333-3333-3333-3333-333333333331',
        work_date: toDate('2026-03-01'),
        quantity: new Prisma.Decimal('40.00'),
        rate: new Prisma.Decimal('2.50'),
        amount: new Prisma.Decimal('100.00')
      },
      {
        id: '44444444-4444-4444-4444-444444444402',
        worker_id: '33333333-3333-3333-3333-333333333331',
        work_date: toDate('2026-03-02'),
        quantity: new Prisma.Decimal('35.00'),
        rate: new Prisma.Decimal('2.50'),
        amount: new Prisma.Decimal('87.50')
      },
      {
        id: '44444444-4444-4444-4444-444444444403',
        worker_id: '33333333-3333-3333-3333-333333333331',
        work_date: toDate('2026-03-03'),
        quantity: new Prisma.Decimal('50.00'),
        rate: new Prisma.Decimal('2.50'),
        amount: new Prisma.Decimal('125.00')
      },
      {
        id: '44444444-4444-4444-4444-444444444404',
        worker_id: '33333333-3333-3333-3333-333333333331',
        work_date: toDate('2026-03-08'),
        quantity: new Prisma.Decimal('20.00'),
        rate: new Prisma.Decimal('2.50'),
        amount: new Prisma.Decimal('50.00')
      },
      {
        id: '44444444-4444-4444-4444-444444444405',
        worker_id: '33333333-3333-3333-3333-333333333332',
        work_date: toDate('2026-02-10'),
        quantity: new Prisma.Decimal('30.00'),
        rate: new Prisma.Decimal('2.50'),
        amount: new Prisma.Decimal('75.00')
      },
      {
        id: '44444444-4444-4444-4444-444444444406',
        worker_id: '33333333-3333-3333-3333-333333333332',
        work_date: toDate('2026-02-11'),
        quantity: new Prisma.Decimal('45.00'),
        rate: new Prisma.Decimal('2.50'),
        amount: new Prisma.Decimal('112.50')
      },
      {
        id: '44444444-4444-4444-4444-444444444407',
        worker_id: '33333333-3333-3333-3333-333333333332',
        work_date: toDate('2026-02-18'),
        quantity: new Prisma.Decimal('25.00'),
        rate: new Prisma.Decimal('2.50'),
        amount: new Prisma.Decimal('62.50')
      },
      {
        id: '44444444-4444-4444-4444-444444444408',
        worker_id: '33333333-3333-3333-3333-333333333333',
        work_date: toDate('2026-03-02'),
        quantity: new Prisma.Decimal('100.00'),
        rate: new Prisma.Decimal('1.80'),
        amount: new Prisma.Decimal('180.00')
      },
      {
        id: '44444444-4444-4444-4444-444444444409',
        worker_id: '33333333-3333-3333-3333-333333333333',
        work_date: toDate('2026-03-03'),
        quantity: new Prisma.Decimal('120.00'),
        rate: new Prisma.Decimal('1.80'),
        amount: new Prisma.Decimal('216.00')
      },
      {
        id: '44444444-4444-4444-4444-444444444410',
        worker_id: '33333333-3333-3333-3333-333333333334',
        work_date: toDate('2026-02-12'),
        quantity: new Prisma.Decimal('90.00'),
        rate: new Prisma.Decimal('1.80'),
        amount: new Prisma.Decimal('162.00')
      },
      {
        id: '44444444-4444-4444-4444-444444444411',
        worker_id: '33333333-3333-3333-3333-333333333334',
        work_date: toDate('2026-03-04'),
        quantity: new Prisma.Decimal('80.00'),
        rate: new Prisma.Decimal('1.80'),
        amount: new Prisma.Decimal('144.00')
      },
      {
        id: '44444444-4444-4444-4444-444444444412',
        worker_id: '33333333-3333-3333-3333-333333333335',
        work_date: toDate('2026-03-05'),
        quantity: new Prisma.Decimal('30.00'),
        rate: new Prisma.Decimal('3.20'),
        amount: new Prisma.Decimal('96.00')
      }
    ]
  });

  await prisma.salaryPayout.createMany({
    data: [
      {
        id: '55555555-5555-5555-5555-555555555551',
        worker_id: '33333333-3333-3333-3333-333333333331',
        period_type: 'weekly',
        period_start: toDate('2026-03-02'),
        period_end: toDate('2026-03-08'),
        total_quantity: new Prisma.Decimal('105.00'),
        total_amount: new Prisma.Decimal('262.50'),
        status: 'pending'
      },
      {
        id: '55555555-5555-5555-5555-555555555552',
        worker_id: '33333333-3333-3333-3333-333333333332',
        period_type: 'monthly',
        period_start: toDate('2026-02-01'),
        period_end: toDate('2026-02-28'),
        total_quantity: new Prisma.Decimal('100.00'),
        total_amount: new Prisma.Decimal('250.00'),
        status: 'paid',
        paid_at: new Date('2026-03-01T10:00:00.000Z')
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
