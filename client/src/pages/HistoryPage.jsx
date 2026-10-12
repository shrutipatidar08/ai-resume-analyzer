import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Trash2,
  ExternalLink,
  ArrowRight,
  Database,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getHistory, getHistoryItem, deleteHistoryItem } from '../services/api';
import { formatDate, getScoreColor } from '../utils/formatters';

export const HistoryPage = () => {
  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState([]);
  const [storageMode, setStorageMode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [openingId, setOpeningId] = useState(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await getHistory();
      if (response && response.success) {
        setHistoryList(response.data || []);
        setStorageMode(response.storageMode || '');
      } else {
        throw new Error(response.error || 'Failed to load history.');
      }
    } catch (err) {
      console.error('Fetch history error:', err);
      setErrorMessage(
        err.response?.data?.error || err.message || 'Unable to retrieve analysis history.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenAnalysis = async (id) => {
    setOpeningId(id);
    try {
      const response = await getHistoryItem(id);
      if (response && response.success && response.data) {
        sessionStorage.setItem('currentAnalysis', JSON.stringify(response.data));
        navigate('/results', { state: { analysisData: response.data } });
      } else {
        throw new Error('Analysis record could not be loaded.');
      }
    } catch (err) {
      alert(`Error loading analysis: ${err.message}`);
    } finally {
      setOpeningId(null);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis record?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteHistoryItem(id);
      setHistoryList((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (err) {
      alert(`Error deleting record: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Audit History
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Past diagnostic evaluations, ATS scores, and target role comparisons.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 transition-colors shadow-xs self-start sm:self-auto"
        >
          <span>Scan Document</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
        </Link>
      </div>

      {/* Storage Mode Pill */}
      {storageMode && (
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded border border-zinc-200">
          <Database className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span>
            Storage: <strong className="text-zinc-900">{storageMode === 'database' ? 'MongoDB Active' : 'Session In-Memory Mode'}</strong>
          </span>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="py-16 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-600 mx-auto" />
          <p className="text-xs font-mono text-zinc-400">Loading records...</p>
        </div>
      ) : historyList.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-xl border border-dashed border-zinc-300 p-12 text-center max-w-sm mx-auto space-y-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 mx-auto">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">No Audits Recorded</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Upload a resume to run the ATS diagnostic and view past evaluations here.
            </p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white bg-zinc-950 hover:bg-zinc-800 transition-colors"
          >
            <span>Scan First Resume</span>
          </Link>
        </div>
      ) : (
        /* List */
        <div className="border border-zinc-200 rounded-xl divide-y divide-zinc-200 bg-white overflow-hidden shadow-xs">
          {historyList.map((item) => {
            const id = item._id || item.id;
            const isOpening = openingId === id;
            const isDeleting = deletingId === id;

            return (
              <div
                key={id}
                onClick={() => handleOpenAnalysis(id)}
                className="p-4 hover:bg-zinc-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-zinc-900 truncate">
                      {item.fileName}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 mt-0.5">
                      <span>{formatDate(item.analysisDate || item.createdAt)}</span>
                      {item.jobTitle && (
                        <span>• Role: <strong className="text-zinc-700">{item.jobTitle}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right scores & actions */}
                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  {/* ATS Score */}
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">ATS</span>
                    <span
                      className="text-sm font-bold font-mono"
                      style={{ color: getScoreColor(item.atsScore) }}
                    >
                      {item.atsScore}/100
                    </span>
                  </div>

                  {/* JD Match */}
                  {item.jobMatchScore !== null && (
                    <div className="text-right pl-3 border-l border-zinc-200">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 block">Match</span>
                      <span className="text-sm font-bold font-mono text-emerald-700">
                        {item.jobMatchScore}%
                      </span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 pl-2">
                    <button
                      onClick={() => handleOpenAnalysis(id)}
                      disabled={isOpening}
                      className="p-1.5 rounded text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                      title="Open audit"
                    >
                      {isOpening ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={(e) => handleDelete(id, e)}
                      disabled={isDeleting}
                      className="p-1.5 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete record"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
