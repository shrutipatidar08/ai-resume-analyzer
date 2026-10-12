import React, { useState } from 'react';
import { Copy, Check, GitCommit, CornerDownRight } from 'lucide-react';

export const BulletComparison = ({ aiFeedback = {}, aiEnhanced = false, aiModel = null }) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopySummary = () => {
    if (aiFeedback?.executiveSummary) {
      navigator.clipboard.writeText(aiFeedback.executiveSummary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  const handleCopyBullet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const bulletList = aiFeedback?.bulletImprovements || [];

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
        <div>
          <h3 className="font-bold text-sm text-zinc-900">Experience Transformations</h3>
          <p className="text-xs text-zinc-600">
            Rewrites structured using the Google X-Y-Z formula (Accomplished [X] measured by [Y] by doing [Z])
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-200 bg-zinc-50 text-zinc-700 font-mono text-[11px] self-start sm:self-auto">
          <GitCommit className="w-3.5 h-3.5 text-zinc-600" />
          <span>{aiEnhanced ? `Model: ${aiModel || 'Ollama'}` : 'Engine: Rule-Based Heuristics'}</span>
        </div>
      </div>

      {/* Tailored Executive Summary */}
      {aiFeedback?.executiveSummary && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 font-semibold">
              Tailored Executive Summary
            </span>
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-zinc-800 leading-relaxed font-sans font-normal">
            "{aiFeedback.executiveSummary}"
          </p>
        </div>
      )}

      {/* Diff-Style Bullet Point Transformations */}
      <div className="space-y-3">
        <h4 className="font-semibold text-xs text-zinc-700 uppercase tracking-wider font-mono">
          Bullet Diff Comparison ({bulletList.length})
        </h4>

        {bulletList.length > 0 ? (
          bulletList.map((bullet, idx) => (
            <div
              key={idx}
              className="border border-zinc-200 rounded-lg overflow-hidden text-xs font-sans"
            >
              {/* Header */}
              <div className="px-3.5 py-1.5 bg-zinc-100/70 border-b border-zinc-200 flex items-center justify-between text-[11px] font-mono text-zinc-600">
                <span>Transformation #{idx + 1}</span>
                <button
                  onClick={() => handleCopyBullet(bullet.improved, idx)}
                  className="hover:text-zinc-950 flex items-center gap-1 transition-colors"
                >
                  {copiedIdx === idx ? (
                    <span className="text-emerald-600 font-medium">Copied!</span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Improved</span>
                    </>
                  )}
                </button>
              </div>

              {/* Before (Original) */}
              <div className="px-3.5 py-2.5 bg-rose-50/40 text-zinc-700 border-b border-zinc-200/60 flex items-start gap-2">
                <span className="font-mono text-rose-600 font-bold select-none shrink-0">-</span>
                <span className="line-through decoration-rose-300 text-zinc-600 leading-relaxed">
                  {bullet.original}
                </span>
              </div>

              {/* After (Improved) */}
              <div className="px-3.5 py-2.5 bg-emerald-50/40 text-zinc-900 font-medium flex items-start gap-2">
                <span className="font-mono text-emerald-600 font-bold select-none shrink-0">+</span>
                <span className="leading-relaxed">
                  {bullet.improved}
                </span>
              </div>

              {/* Rationale Footer */}
              {bullet.reasoning && (
                <div className="px-3.5 py-2 bg-zinc-50 border-t border-zinc-200/80 text-[11px] text-zinc-600 flex items-start gap-1.5 font-mono">
                  <CornerDownRight className="w-3 h-3 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{bullet.reasoning}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-zinc-400 italic">No bullet point rewrites available.</p>
        )}
      </div>
    </div>
  );
};
