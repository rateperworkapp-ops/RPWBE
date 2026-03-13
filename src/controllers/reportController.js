const reportService = require('../services/reportService');

const getDailyReport = async (req, res, next) => {
  try {
    const report = await reportService.getDailyReport(req.query.date);

    return res.status(200).json({
      success: true,
      message: 'Daily report fetched successfully',
      data: report
    });
  } catch (error) {
    return next(error);
  }
};

const getWeeklyReport = async (req, res, next) => {
  try {
    const report = await reportService.getWeeklyReport(req.query.startDate, req.query.endDate);

    return res.status(200).json({
      success: true,
      message: 'Weekly report fetched successfully',
      data: report
    });
  } catch (error) {
    return next(error);
  }
};

const getMonthlyReport = async (req, res, next) => {
  try {
    const report = await reportService.getMonthlyReport(req.query.month);

    return res.status(200).json({
      success: true,
      message: 'Monthly report fetched successfully',
      data: report
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport
};
