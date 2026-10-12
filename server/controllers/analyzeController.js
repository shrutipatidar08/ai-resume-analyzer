const { extractTextFromResume } = require('../services/parserService');
const { analyzeResume } = require('../services/analysisEngine');
const { matchResumeWithJob } = require('../services/jobMatchService');
const { getAIEnhancedFeedback } = require('../services/aiService');
const { generatePdfReport } = require('../services/pdfService');
const AnalysisHistory = require('../models/AnalysisHistory');
const { isDbConnected, inMemoryHistory } = require('../config/db');

/**
 * POST /api/analyze
 * Handles resume upload (PDF/DOCX) and optional job description
 */
const analyzeResumeHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No resume file uploaded. Please upload a PDF or DOCX file.',
      });
    }

    const { jobDescription = '' } = req.body;

    // 1. Extract text from uploaded document
    const { text, pageCount, format, wordCount } = await extractTextFromResume(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // 2. Perform deep ATS Analysis
    const analysis = analyzeResume(text, req.file.originalname);

    // 3. Match against Job Description if provided
    let jobMatch = null;
    if (jobDescription && jobDescription.trim().length > 0) {
      jobMatch = matchResumeWithJob(text, jobDescription, analysis.extractedData.identifiedSkills);
    } else {
      jobMatch = {
        hasJobMatch: false,
        matchPercentage: null,
        matchingKeywords: [],
        missingKeywords: [],
        matchingSkills: [],
        skillsToDevelop: [],
        tailoringSuggestions: [],
      };
    }

    // 4. Generate AI enhancements or rule-based feedback
    const aiFeedback = await getAIEnhancedFeedback(text, analysis, jobMatch);

    // 5. Build combined record
    const recordData = {
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      analysisDate: new Date(),
      atsScore: analysis.atsScore,
      jobMatchScore: jobMatch.hasJobMatch ? jobMatch.matchPercentage : null,
      jobTitle: jobMatch.detectedRole || '',
      categoryScores: analysis.categoryScores,
      rawCategoryPoints: analysis.rawCategoryPoints,
      extractedData: {
        ...analysis.extractedData,
        pageCount,
        format,
        wordCount,
      },
      analysisResults: analysis.analysisResults,
      jobMatchResults: jobMatch,
      aiEnhanced: aiFeedback.aiEnhanced,
      aiModel: aiFeedback.model,
      aiFeedback: {
        executiveSummary: aiFeedback.executiveSummary,
        bulletImprovements: aiFeedback.bulletImprovements,
        customizedRecommendations: aiFeedback.customizedRecommendations,
        statusNote: aiFeedback.statusNote,
      },
      disclaimer: analysis.disclaimer,
    };

    // 6. Save to Database or fallback to in-memory store
    let savedRecord = null;
    if (isDbConnected()) {
      try {
        savedRecord = await AnalysisHistory.create(recordData);
      } catch (dbErr) {
        console.warn('Failed to save history in Mongo:', dbErr.message);
      }
    }

    if (!savedRecord) {
      // In-memory fallback
      const inMemId = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      savedRecord = {
        _id: inMemId,
        id: inMemId,
        ...recordData,
        createdAt: new Date(),
      };
      inMemoryHistory.unshift(savedRecord);
      // Keep in-memory store bounded
      if (inMemoryHistory.length > 50) inMemoryHistory.pop();
    }

    return res.status(200).json({
      success: true,
      data: {
        id: savedRecord._id,
        ...recordData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/match-job
 * Standalone job description comparison for an already extracted resume or text
 */
const matchJobHandler = async (req, res, next) => {
  try {
    const { resumeText, jobDescription, extractedSkills } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Resume text is required and must contain at least 50 characters.',
      });
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        error: 'Job description is required and must contain at least 20 characters.',
      });
    }

    const matchResults = matchResumeWithJob(resumeText, jobDescription, extractedSkills);

    return res.status(200).json({
      success: true,
      data: matchResults,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/export-pdf
 * Generates and downloads a PDF audit report
 */
const exportPdfHandler = async (req, res, next) => {
  try {
    const analysisData = req.body;

    if (!analysisData || !analysisData.atsScore) {
      return res.status(400).json({
        success: false,
        error: 'Invalid analysis data provided for PDF generation.',
      });
    }

    const pdfBuffer = await generatePdfReport(analysisData);

    const safeName = (analysisData.fileName || 'resume')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="ATS_Report_${safeName}.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeResumeHandler,
  matchJobHandler,
  exportPdfHandler,
};
