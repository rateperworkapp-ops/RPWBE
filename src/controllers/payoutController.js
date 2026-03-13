const payoutService = require('../services/payoutService');

const generatePayout = async (req, res, next) => {
  try {
    const payout = await payoutService.generatePayout(req.body);

    return res.status(201).json({
      success: true,
      message: 'Payout generated successfully',
      data: payout
    });
  } catch (error) {
    return next(error);
  }
};

const getPayouts = async (req, res, next) => {
  try {
    const payouts = await payoutService.getPayouts();

    return res.status(200).json({
      success: true,
      message: 'Payouts fetched successfully',
      data: payouts
    });
  } catch (error) {
    return next(error);
  }
};

const getPayoutById = async (req, res, next) => {
  try {
    const payout = await payoutService.getPayoutById(req.params.id);

    if (!payout) {
      const error = new Error('Payout not found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Payout fetched successfully',
      data: payout
    });
  } catch (error) {
    return next(error);
  }
};

const payPayout = async (req, res, next) => {
  try {
    const payout = await payoutService.payPayout(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Payout marked as paid successfully',
      data: payout
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generatePayout,
  getPayouts,
  getPayoutById,
  payPayout
};
