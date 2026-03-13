const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authMiddleware = require('./middleware/authMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const workerRoutes = require('./routes/workerRoutes');
const workEntryRoutes = require('./routes/workEntryRoutes');
const reportRoutes = require('./routes/reportRoutes');
const payoutRoutes = require('./routes/payoutRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/departments', authMiddleware, departmentRoutes);
app.use('/api/workers', authMiddleware, workerRoutes);
app.use('/api/work-entries', authMiddleware, workEntryRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/payouts', authMiddleware, payoutRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
