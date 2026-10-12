import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { getScoreColor } from '../utils/formatters';

export const CategoryScoreChart = ({ categoryScores = {} }) => {
  const data = [
    { name: 'Contact Info', score: categoryScores.contactInfo || 0 },
    { name: 'Section Hierarchy', score: categoryScores.sectionCompleteness || 0 },
    { name: 'Technical Skills', score: categoryScores.technicalSkills || 0 },
    { name: 'Work Impact', score: categoryScores.experience || 0 },
    { name: 'Projects', score: categoryScores.projects || 0 },
    { name: 'Education', score: categoryScores.education || 0 },
    { name: 'Certifications', score: categoryScores.certifications || 0 },
    { name: 'ATS Readability', score: categoryScores.readability || 0 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-zinc-900 text-white px-2.5 py-1.5 rounded shadow text-xs font-mono">
          <p className="font-semibold text-zinc-200">{item.name}</p>
          <p className="text-emerald-400 font-bold">{item.score}% Match</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div>
          <h3 className="font-bold text-sm text-zinc-900">Category Evaluation Breakdown</h3>
          <p className="text-xs text-zinc-600">Scores computed across 8 ATS parsing benchmarks</p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded border border-zinc-200">
          8 Pillars
        </span>
      </div>

      {/* Chart container */}
      <div className="h-56 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 10, left: -25, bottom: 20 }}>
            <XAxis
              dataKey="name"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              angle={-20}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[3, 3, 0, 0]} maxBarSize={32}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#3b82f6' : entry.score >= 40 ? '#f59e0b' : '#ef4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Mini Progress Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-zinc-100">
        {data.map((cat) => (
          <div key={cat.name} className="bg-zinc-50/80 p-2.5 rounded-lg border border-zinc-200/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-zinc-600 text-[11px] truncate font-medium">{cat.name}</span>
              <span className="font-mono font-bold text-xs text-zinc-900">{cat.score}%</span>
            </div>
            <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cat.score}%`,
                  backgroundColor: cat.score >= 80 ? '#10b981' : cat.score >= 60 ? '#3b82f6' : cat.score >= 40 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
