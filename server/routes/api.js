const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const { getHealthStatus } = require('../controllers/healthController');
const {
  analyzeResumeHandler,
  matchJobHandler,
  exportPdfHandler,
} = require('../controllers/analyzeController');
const {
  getHistoryList,
  getHistoryById,
  deleteHistoryById,
} = require('../controllers/historyController');

// System Health & diagnostics
router.get('/health', getHealthStatus);

// Resume Analysis & Upload
router.post('/analyze', upload.single('resume'), analyzeResumeHandler);

// Standalone Job Description Matching
router.post('/match-job', matchJobHandler);

// PDF Export
router.post('/export-pdf', exportPdfHandler);

// Analysis History
router.get('/history', getHistoryList);
router.get('/history/:id', getHistoryById);
router.delete('/history/:id', deleteHistoryById);

module.exports = router;
