# Factory Worker Productivity and Salary Management System (Backend MVP)

Backend API for manager authentication, department/worker management, daily work entry tracking, salary reports, and payout lifecycle.

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT auth
- bcrypt
- dotenv
- cors
- helmet
- morgan
- express-validator

## Environment Variables
Create `.env` from `.env.example`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
```

### Neon Notes
- `DATABASE_URL` should use Neon pooled connection string.
- `DIRECT_URL` should use Neon direct (non-pooled) connection string for migrations.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
3. Run migrations:
   ```bash
   npm run prisma:migrate
   ```
4. Start server:
   ```bash
   npm run dev
   ```
5. Register the first manager with `POST /api/auth/register`.

Optional sample data seed:

```bash
npm run prisma:seed
```

## Production Deploy (Neon)
Run schema migrations in deployment environment.

For Render, use `npm start` as the Start Command so Prisma runs `prisma migrate deploy` before the server boots:

```bash
npm run prisma:deploy
```

Optional seed (only if needed):

```bash
npm run prisma:seed
```

## First Manager Registration
After an empty database reset, create the first manager with `POST /api/auth/register`.
There is no default manager account unless you run the optional seed script.

## API Base Prefix
- `/api`

## Response Shape
### Success
```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Human readable error message",
  "errors": []
}
```

## Routes
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Departments
- `POST /api/departments`
- `GET /api/departments`
- `GET /api/departments/:id`
- `PUT /api/departments/:id`
- `DELETE /api/departments/:id`

### Workers
- `POST /api/workers`
- `GET /api/workers`
- Optional worker query params: `search`, `department_id`
- `GET /api/workers/:id`
- `PUT /api/workers/:id`
- `DELETE /api/workers/:id`

### Work Entries
- `POST /api/work-entries`
- `GET /api/work-entries`
- `GET /api/work-entries/worker/:workerId`

### Reports
- `GET /api/reports/daily?date=YYYY-MM-DD`
- `GET /api/reports/weekly?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- `GET /api/reports/monthly?month=YYYY-MM`

### Payouts
- `POST /api/payouts/generate`
- `GET /api/payouts`
- `GET /api/payouts/:id`
- `PATCH /api/payouts/:id/pay`

## Payout Workflow
1. Manager creates daily work entries.
2. System snapshots department rate into each work entry (`rate`, `amount`).
3. Manager generates weekly/monthly payout for worker and date range.
4. System stores payout separately with `pending` status.
5. Manager marks payout as paid.
6. System updates payout to `paid` and sets `paid_at`.

## Sample API Calls
### Register Manager
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@example.com","password":"manager123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@example.com","password":"manager123"}'
```

### Generate Payout
```bash
curl -X POST http://localhost:5000/api/payouts/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"worker_id":"WORKER_UUID","period_type":"weekly","period_start":"2026-03-01","period_end":"2026-03-07"}'
```


