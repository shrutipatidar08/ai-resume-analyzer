import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  ArrowRight,
  Briefcase,
  FileUp,
  Check,
} from 'lucide-react';
import { analyzeResume } from '../services/api';
import { LoadingState } from '../components/LoadingState';
import { formatFileSize } from '../utils/formatters';
import { SAMPLE_JOB_DESCRIPTIONS } from '../utils/constants';

export const AnalyzerPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateAndSetFile = (selectedFile) => {
    setErrorMessage('');
    if (!selectedFile) return;

    const validExtensions = ['.pdf', '.docx', '.doc'];
    const fileName = selectedFile.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidExt) {
      setErrorMessage(
        'Invalid file type. Please upload a PDF (.pdf) or Word document (.docx / .doc).'
      );
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10 MB limit. Please upload a smaller document.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrorMessage('');
  };

  const handleInsertSampleJd = (sample) => {
    setJobDescription(sample.description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select or upload a resume file (PDF or DOCX).');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription.trim());
      }

      const response = await analyzeResume(formData);

      if (response && response.success && response.data) {
        sessionStorage.setItem('currentAnalysis', JSON.stringify(response.data));
        navigate('/results', { state: { analysisData: response.data } });
      } else {
        throw new Error(response.error || 'Failed to complete resume analysis.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      const apiError =
        err.response?.data?.error ||
        err.message ||
        'An error occurred during file parsing. Ensure your document contains selectable text and try again.';
      setErrorMessage(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
          Audit Resume
        </h1>
        <p className="text-xs text-zinc-500">
          Upload your document to evaluate ATS compatibility, check section completeness, and compare against a job description.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">Validation Notice</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Dropzone */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-700 font-mono">
              01. Resume Document
            </h2>
            <span className="text-[11px] font-mono text-zinc-400">PDF, DOCX up to 10MB</span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            id="resume-file-input"
          />

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-zinc-950 bg-zinc-50'
                  : 'border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/50'
              }`}
            >
              <div className="w-10 h-10 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-600 mx-auto mb-3">
                <FileUp className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-zinc-900">
                Click to browse or drop file here
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Text-selectable PDF or Word (.docx) files
              </p>
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded bg-zinc-950 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-zinc-200" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                    {formatFileSize(file.size)} • {file.name.endsWith('.pdf') ? 'PDF' : 'DOCX'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3 h-3" />
                  Loaded
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-700 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Job Description Input */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xs uppercase tracking-wider text-zinc-700 font-mono">
              02. Target Job Description <span className="text-zinc-400 font-normal">(Optional)</span>
            </h2>
            {jobDescription && (
              <button
                type="button"
                onClick={() => setJobDescription('')}
                className="text-[11px] font-mono text-zinc-400 hover:text-zinc-700"
              >
                Clear
              </button>
            )}
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            placeholder="Paste target job responsibilities, requirements, or qualifications here to benchmark matching keywords..."
            className="w-full p-3 rounded-lg border border-zinc-200 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 outline-none text-xs leading-relaxed text-zinc-900 placeholder:text-zinc-400 transition-colors resize-y font-sans"
          />

          {/* Quick Samples */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-mono text-zinc-400 mr-1">
              Sample Roles:
            </span>
            {SAMPLE_JOB_DESCRIPTIONS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleInsertSampleJd(sample)}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 transition-colors"
              >
                + {sample.title.split(' ')[0]} {sample.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={!file}
            className={`w-full py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              file
                ? 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-xs cursor-pointer'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
            }`}
          >
            <span>Run ATS Diagnostic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <p className="text-center text-[11px] font-mono text-zinc-400 mt-2">
            In-memory processing • Never shared with third parties
          </p>
        </div>
      </form>
    </div>
  );
};
