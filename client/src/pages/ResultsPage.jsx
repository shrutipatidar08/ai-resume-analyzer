import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Download,
  ArrowLeft,
  FileText,
  Calendar,
  Check,
  RotateCcw,
  Loader2,
  Terminal,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { CategoryScoreChart } from '../components/CategoryScoreChart';
import { SkillsDisplay } from '../components/SkillsDisplay';
import { StrengthsWeaknesses } from '../components/StrengthsWeaknesses';
import { BulletComparison } from '../components/BulletComparison';
import { downloadPdfReport } from '../services/api';
import { exportClientPdfReport } from '../services/pdfExport';
import { formatDate } from '../utils/formatters';

export const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    if (location.state && location.state.analysisData) {
      setData(location.state.analysisData);
    } else {
      const saved = sessionStorage.getItem('currentAnalysis');
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse cached analysis:', e);
        }
      }
    }
  }, [location.state]);

  const handleDownloadPdf = async () => {
    if (!data) return;
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const blob = await downloadPdfReport(data);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ATS_Report_${(data.fileName || 'resume').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setExportSuccess(true);
    } catch (err) {
      console.warn('Backend export fallback to jsPDF:', err.message);
      exportClientPdfReport(data);
      setExportSuccess(true);
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportSuccess(false), 3000);
    }
  };

  if (!data) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-950">No Analysis Loaded</h2>
          <p className="text-xs text-zinc-500">
            Upload a resume to run the ATS diagnostic and view detailed metrics.
          </p>
        </div>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 transition-colors"
        >
          <span>Go to Analyzer</span>
        </Link>
      </div>
    );
  }

  const hasJobMatch = data.jobMatchResults && data.jobMatchResults.hasJobMatch;
  const matchPercentage = hasJobMatch ? data.jobMatchResults.matchPercentage : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Link to="/analyze" className="hover:text-zinc-900 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </Link>
            <span>/</span>
            <span>{formatDate(data.analysisDate)}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight flex items-center gap-2">
            <span className="truncate">{data.fileName}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700">
              {data.aiEnhanced ? `AI: ${data.aiModel || 'Ollama'}` : 'Engine: Rule-Based'}
            </span>
            {data.extractedData?.contact?.name && (
              <span className="text-zinc-600">
                Candidate: <strong className="text-zinc-900">{data.extractedData.contact.name}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span>New Scan</span>
          </Link>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium text-white bg-zinc-950 hover:bg-zinc-800 transition-colors shadow-xs"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall ATS Gauge */}
        <ScoreGauge
          score={data.atsScore}
          title="ATS Compatibility Index"
        />

        {/* Job Match Card */}
        {hasJobMatch ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-semibold text-xs text-zinc-500 uppercase tracking-wider font-mono">
                Job Description Match
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                {matchPercentage >= 75 ? 'Strong Fit' : 'Moderate Match'}
              </span>
            </div>

            <div className="py-6 flex items-center justify-center gap-6">
              <div className="text-center">
                <span className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight block">
                  {matchPercentage}%
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  Keyword Overlap
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-zinc-500 text-[11px] block">Role Identified</span>
                  <span className="font-semibold text-zinc-800 truncate block max-w-[130px]">
                    {data.jobTitle || 'Target Role'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[11px] block">Matching Terms</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {data.jobMatchResults.matchingKeywords?.length || 0} terms
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
              {data.jobMatchResults.matchingSkills?.length || 0} of {data.jobMatchResults.totalJdSkillsCount || 0} technical skills matched.
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-zinc-300 p-5 shadow-xs flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Job Description Match</span>
            <p className="text-xs text-zinc-400 max-w-xs">
              No target job posting was provided during upload. Add a job description to compare keywords.
            </p>
            <Link
              to="/analyze"
              className="text-xs font-mono text-zinc-900 underline hover:text-zinc-600 pt-1"
            >
              Analyze with Job Posting →
            </Link>
          </div>
        )}

        {/* Extracted Metrics Card */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="font-semibold text-xs text-zinc-500 uppercase tracking-wider font-mono">
              Document Signal Summary
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Extracted</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-3">
            <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200/80">
              <span className="text-zinc-500 text-[11px] font-mono block">Tech Skills</span>
              <span className="font-mono font-bold text-base text-zinc-900">
                {data.extractedData?.identifiedSkills?.all?.length || 0}
              </span>
            </div>
            <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200/80">
              <span className="text-zinc-500 text-[11px] font-mono block">Action Verbs</span>
              <span className="font-mono font-bold text-base text-zinc-900">
                {data.analysisResults?.actionVerbCount || 0}
              </span>
            </div>
            <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200/80">
              <span className="text-zinc-500 text-[11px] font-mono block">Metrics (%, $)</span>
              <span className="font-mono font-bold text-base text-zinc-900">
                {data.analysisResults?.quantifiedMetricsCount || 0}
              </span>
            </div>
            <div className="p-2.5 bg-zinc-50 rounded border border-zinc-200/80">
              <span className="text-zinc-500 text-[11px] font-mono block">Word Count</span>
              <span className="font-mono font-bold text-base text-zinc-900">
                {data.extractedData?.wordCount || 0}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 text-[11px] font-mono text-zinc-500">
            Format: {data.extractedData?.format || 'PDF'} • ~{data.extractedData?.pageCount || 1} page(s)
          </div>
        </div>
      </div>

      {/* Category Breakdown Recharts Section */}
      <CategoryScoreChart categoryScores={data.categoryScores} />

      {/* Skills Footprint */}
      <SkillsDisplay
        identifiedSkills={data.extractedData?.identifiedSkills}
        jobMatchResults={data.jobMatchResults}
      />

      {/* Section Checklist, Strengths & Critical Gaps */}
      <StrengthsWeaknesses
        strengths={data.analysisResults?.strengths}
        weaknesses={data.analysisResults?.weaknesses}
        missingInformation={data.analysisResults?.missingInformation}
        improvementTips={data.analysisResults?.improvementTips}
        detectedSections={data.extractedData?.detectedSections}
      />

      {/* Diff-Style Experience Transformations */}
      <BulletComparison
        aiFeedback={data.aiFeedback}
        aiEnhanced={data.aiEnhanced}
        aiModel={data.aiModel}
      />
    </div>
  );
};
