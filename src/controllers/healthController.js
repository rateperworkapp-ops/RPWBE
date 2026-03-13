const getHealth = (req, res) => res.status(200).json({
  success: true,
  message: 'API is healthy',
  data: {
    status: 'ok',
    uptime_seconds: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString()
  }
});

module.exports = {
  getHealth
};
