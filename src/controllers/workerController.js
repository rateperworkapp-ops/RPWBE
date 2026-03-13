const workerService = require('../services/workerService');

const createWorker = async (req, res, next) => {
  try {
    const worker = await workerService.createWorker(req.body);

    return res.status(201).json({
      success: true,
      message: 'Worker created successfully',
      data: worker
    });
  } catch (error) {
    return next(error);
  }
};

const getWorkers = async (req, res, next) => {
  try {
    const workers = await workerService.getWorkers();

    return res.status(200).json({
      success: true,
      message: 'Workers fetched successfully',
      data: workers
    });
  } catch (error) {
    return next(error);
  }
};

const getWorkerById = async (req, res, next) => {
  try {
    const worker = await workerService.getWorkerById(req.params.id);

    if (!worker) {
      const error = new Error('Worker not found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Worker fetched successfully',
      data: worker
    });
  } catch (error) {
    return next(error);
  }
};

const updateWorker = async (req, res, next) => {
  try {
    const worker = await workerService.updateWorker(req.params.id, req.body);

    if (!worker) {
      const error = new Error('Worker not found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Worker updated successfully',
      data: worker
    });
  } catch (error) {
    return next(error);
  }
};

const deleteWorker = async (req, res, next) => {
  try {
    const worker = await workerService.deleteWorker(req.params.id);

    if (!worker) {
      const error = new Error('Worker not found');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Worker deleted successfully',
      data: worker
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createWorker,
  getWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker
};
