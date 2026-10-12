const mongoose = require('mongoose');

const AnalysisHistorySchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    analysisDate: {
      type: Date,
      default: Date.now,
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    jobMatchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    jobTitle: {
      type: String,
      default: '',
    },
    categoryScores: {
      contactInfo: { type: Number, default: 0 },
      sectionCompleteness: { type: Number, default: 0 },
      technicalSkills: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      certifications: { type: Number, default: 0 },
      readability: { type: Number, default: 0 },
    },
    extractedData: {
      contact: {
        name: String,
        email: String,
        phone: String,
        linkedin: String,
        github: String,
        portfolio: String,
        location: String,
      },
      detectedSections: [String],
      identifiedSkills: {
        frontend: [String],
        backend: [String],
        databases: [String],
        cloud_devops: [String],
        ai_data: [String],
        mobile: [String],
        methodologies_tools: [String],
        soft_skills: [String],
        all: [String],
      },
      wordCount: Number,
      characterCount: Number,
    },
    analysisResults: {
      strengths: [String],
      weaknesses: [String],
      missingInformation: [String],
      improvementTips: [String],
      projectTips: [String],
      achievementTips: [String],
      readabilityTips: [String],
      actionVerbCount: Number,
      quantifiedMetricsCount: Number,
    },
    jobMatchResults: {
      hasJobMatch: Boolean,
      matchPercentage: Number,
      matchingKeywords: [String],
      missingKeywords: [String],
      matchingSkills: [String],
      skillsToDevelop: [String],
      tailoringSuggestions: [String],
    },
    aiEnhanced: {
      type: Boolean,
      default: false,
    },
    aiModel: {
      type: String,
      default: null,
    },
    aiFeedback: {
      executiveSummary: String,
      bulletImprovements: [
        {
          original: String,
          improved: String,
          reasoning: String,
        },
      ],
      customizedRecommendations: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorting by recent analyses
AnalysisHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('AnalysisHistory', AnalysisHistorySchema);
