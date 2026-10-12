import React from 'react';
import { getScoreColor, getScoreLabel } from '../utils/formatters';
import { Info, Award } from 'lucide-react';

export const ScoreGauge = ({ score = 0, title = 'ATS Compatibility Index', subtitle = 'Estimated score based on standard ATS heuristics' }) => {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const { label, color, bg } = getScoreLabel(normalizedScore);
  const strokeColor = getScoreColor(normalizedScore);

  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
      {/* Background Soft Accent Tint */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 pointer-events-none blur-xl"
        style={{ backgroundColor: strokeColor }}
      />

      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          <span>{title}</span>
        </h3>
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border font-mono ${bg} ${color}`}>
          {label}
        </span>
      </div>

      <div className="py-6 flex items-center justify-center gap-6">
        {/* SVG Dial with Color */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active Colored Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute flex flex-col items-center justify-center">
            <span
              className="text-4xl font-extrabold font-mono tracking-tight leading-none"
              style={{ color: strokeColor }}
            >
              {normalizedScore}
            </span>
            <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase font-semibold">
              out of 100
            </span>
          </div>
        </div>

        {/* Breakdown notes */}
        <div className="space-y-2.5 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Readiness Tier</span>
            <span
              className="font-bold font-mono text-xs"
              style={{ color: strokeColor }}
            >
              {normalizedScore >= 80 ? 'ATS Pass Tier (80+)' : normalizedScore >= 60 ? 'Competitive (60-79)' : 'Needs Revision (<60)'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">Text Selectability</span>
            <span className="font-semibold text-emerald-600 font-mono text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified (High)
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <span>Algorithmic estimate derived from section hierarchy, action verbs & keywords.</span>
      </div>
    </div>
  );
};
