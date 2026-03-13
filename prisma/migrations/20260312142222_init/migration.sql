-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('kg', 'piece');

-- CreateEnum
CREATE TYPE "PayoutPeriodType" AS ENUM ('weekly', 'monthly');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('pending', 'paid');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "rate" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "department_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_entries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "worker_id" UUID NOT NULL,
    "work_date" DATE NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "rate" DECIMAL(12,2) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_payouts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "worker_id" UUID NOT NULL,
    "period_type" "PayoutPeriodType" NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "total_quantity" DECIMAL(12,2) NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'pending',
    "paid_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_workers_department_id" ON "workers"("department_id");

-- CreateIndex
CREATE INDEX "idx_work_entries_worker_id" ON "work_entries"("worker_id");

-- CreateIndex
CREATE INDEX "idx_work_entries_work_date" ON "work_entries"("work_date");

-- CreateIndex
CREATE INDEX "idx_work_entries_worker_id_work_date" ON "work_entries"("worker_id", "work_date");

-- CreateIndex
CREATE INDEX "idx_salary_payouts_worker_id" ON "salary_payouts"("worker_id");

-- CreateIndex
CREATE INDEX "idx_salary_payouts_period_type" ON "salary_payouts"("period_type");

-- CreateIndex
CREATE INDEX "idx_salary_payouts_status" ON "salary_payouts"("status");

-- CreateIndex
CREATE INDEX "idx_salary_payouts_period_start_period_end" ON "salary_payouts"("period_start", "period_end");

-- CreateIndex
CREATE UNIQUE INDEX "salary_payouts_worker_id_period_type_period_start_period_en_key" ON "salary_payouts"("worker_id", "period_type", "period_start", "period_end");

-- AddForeignKey
ALTER TABLE "workers" ADD CONSTRAINT "workers_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_entries" ADD CONSTRAINT "work_entries_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_payouts" ADD CONSTRAINT "salary_payouts_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
