import React from 'react';
import { Check, AlertCircle, FileCheck, ArrowRight } from 'lucide-react';

export const StrengthsWeaknesses = ({
  strengths = [],
  weaknesses = [],
  missingInformation = [],
  improvementTips = [],
  detectedSections = [],
}) => {
  const allCoreSections = [
    'Work Experience',
    'Education',
    'Skills',
    'Projects',
    'Summary',
    'Certifications',
  ];

  return (
    <div className="space-y-4">
      {/* Section Structure Checklist */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
          <div>
            <h3 className="font-bold text-sm text-zinc-900">Standard Section Hierarchy</h3>
            <p className="text-xs text-zinc-600">Verification of common ATS parsing headings</p>
          </div>
          <span className="text-xs font-mono text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
            {detectedSections.length}/{allCoreSections.length} present
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {allCoreSections.map((sec) => {
            const isPresent = detectedSections.includes(sec);
            return (
              <div
                key={sec}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-colors ${
                  isPresent
                    ? 'bg-zinc-50/80 border-zinc-200 text-zinc-900'
                    : 'bg-zinc-50/40 border-dashed border-zinc-200 text-zinc-600'
                }`}
              >
                <span className="truncate">{sec}</span>
                {isPresent ? (
                  <span className="text-emerald-600 font-bold ml-1">✓</span>
                ) : (
                  <span className="text-zinc-500 font-bold ml-1">—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Weaknesses 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-700 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Resume Strengths</span>
            </h4>
            <span className="text-xs font-mono text-zinc-600">{strengths.length} noted</span>
          </div>

          <div className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 leading-relaxed">
                  <span className="text-emerald-600 font-bold mt-0.5 shrink-0">✓</span>
                  <span>{str}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-600 italic">No notable positives found in text.</p>
            )}
          </div>
        </div>

        {/* Weaknesses & Critical Gaps */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-700 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Areas for Revision</span>
            </h4>
            <span className="text-xs font-mono text-zinc-600">{weaknesses.length} items</span>
          </div>

          <div className="space-y-2">
            {weaknesses.length > 0 ? (
              weaknesses.map((weak, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 leading-relaxed">
                  <span className="text-rose-600 font-bold mt-0.5 shrink-0">✕</span>
                  <span>{weak}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-700 font-medium">No major structural issues detected.</p>
            )}

            {missingInformation.length > 0 && (
              <div className="pt-2 mt-2 border-t border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider block mb-1">
                  Missing Fields:
                </span>
                <div className="flex flex-wrap gap-1">
                  {missingInformation.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-50 text-rose-800 border border-rose-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actionable Improvement Steps */}
      <div className="bg-zinc-900 text-white rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-200 font-mono">
            ATS Optimization Checklist
          </h4>
          <span className="text-[11px] font-mono text-zinc-400">Action Plan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {improvementTips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-zinc-800/80 border border-zinc-700/80 p-3 rounded-lg flex items-start gap-2.5"
            >
              <span className="font-mono text-zinc-400 text-xs font-semibold shrink-0">
                0{idx + 1}.
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
