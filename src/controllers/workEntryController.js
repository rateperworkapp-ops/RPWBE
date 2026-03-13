const workEntryService = require('../services/workEntryService');

const createWorkEntry = async (req, res, next) => {
  try {
    const workEntry = await workEntryService.createWorkEntry(req.body);

    return res.status(201).json({
      success: true,
      message: 'Work entry created successfully',
      data: workEntry
    });
  } catch (error) {
    return next(error);
  }
};

const getWorkEntries = async (req, res, next) => {
  try {
    const workEntries = await workEntryService.getWorkEntries();

    return res.status(200).json({
      success: true,
      message: 'Work entries fetched successfully',
      data: workEntries
    });
  } catch (error) {
    return next(error);
  }
};

const getWorkEntriesByWorkerId = async (req, res, next) => {
  try {
    const workEntries = await workEntryService.getWorkEntriesByWorkerId(req.params.workerId);

    return res.status(200).json({
      success: true,
      message: 'Worker work entries fetched successfully',
      data: workEntries
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createWorkEntry,
  getWorkEntries,
  getWorkEntriesByWorkerId
};
