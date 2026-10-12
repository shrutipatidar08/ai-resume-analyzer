const AnalysisHistory = require('../models/AnalysisHistory');
const { isDbConnected, inMemoryHistory } = require('../config/db');

/**
 * GET /api/history
 * Retrieves list of past resume analyses
 */
const getHistoryList = async (req, res, next) => {
  try {
    let history = [];

    if (isDbConnected()) {
      history = await AnalysisHistory.find({}, {
        fileName: 1,
        analysisDate: 1,
        atsScore: 1,
        jobMatchScore: 1,
        jobTitle: 1,
        aiEnhanced: 1,
        createdAt: 1,
      })
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      // In-memory fallback
      history = inMemoryHistory.map((item) => ({
        _id: item._id,
        fileName: item.fileName,
        analysisDate: item.analysisDate,
        atsScore: item.atsScore,
        jobMatchScore: item.jobMatchScore,
        jobTitle: item.jobTitle,
        aiEnhanced: item.aiEnhanced,
        createdAt: item.createdAt,
      }));
    }

    return res.status(200).json({
      success: true,
      count: history.length,
      storageMode: isDbConnected() ? 'database' : 'session_in_memory',
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/history/:id
 * Retrieves full details of a specific analysis record
 */
const getHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let record = null;
    if (isDbConnected() && !id.startsWith('mem_')) {
      record = await AnalysisHistory.findById(id);
    } else {
      record = inMemoryHistory.find((item) => String(item._id) === id || String(item.id) === id);
    }

    if (!record) {
      return res.status(404).json({
        success: false,
        error: `Analysis record with ID '${id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/history/:id
 * Deletes an analysis record
 */
const deleteHistoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let deleted = false;
    if (isDbConnected() && !id.startsWith('mem_')) {
      const result = await AnalysisHistory.findByIdAndDelete(id);
      deleted = !!result;
    } else {
      const idx = inMemoryHistory.findIndex((item) => String(item._id) === id || String(item.id) === id);
      if (idx !== -1) {
        inMemoryHistory.splice(idx, 1);
        deleted = true;
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Analysis record with ID '${id}' not found to delete.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Analysis record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistoryList,
  getHistoryById,
  deleteHistoryById,
};
