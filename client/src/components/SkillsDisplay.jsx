import React, { useState } from 'react';
import { Check, Plus, Tag, Layers } from 'lucide-react';

export const SkillsDisplay = ({ identifiedSkills = {}, jobMatchResults = null }) => {
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', label: 'All', count: identifiedSkills?.all?.length || 0 },
    { id: 'frontend', label: 'Frontend', count: identifiedSkills?.frontend?.length || 0 },
    { id: 'backend', label: 'Backend', count: identifiedSkills?.backend?.length || 0 },
    { id: 'databases', label: 'Databases', count: identifiedSkills?.databases?.length || 0 },
    { id: 'cloud_devops', label: 'Cloud/DevOps', count: identifiedSkills?.cloud_devops?.length || 0 },
    { id: 'ai_data', label: 'AI/Data', count: identifiedSkills?.ai_data?.length || 0 },
    { id: 'soft_skills', label: 'Soft Skills', count: identifiedSkills?.soft_skills?.length || 0 },
  ];

  const currentSkills = activeTab === 'all'
    ? identifiedSkills?.all || []
    : identifiedSkills?.[activeTab] || [];

  const hasJobMatch = jobMatchResults && jobMatchResults.hasJobMatch;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
        <div>
          <h3 className="font-bold text-sm text-zinc-900">Extracted Skills Footprint</h3>
          <p className="text-xs text-zinc-600">
            Detected technologies mapped from industry skill taxonomies
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-700 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded self-start sm:self-auto">
          {identifiedSkills?.all?.length || 0} skills detected
        </span>
      </div>

      {/* Segmented Control Tabs */}
      <div className="inline-flex items-center gap-1 p-1 bg-zinc-100 rounded-lg border border-zinc-200/80 overflow-x-auto max-w-full">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === cat.id
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {cat.label} <span className="font-mono text-[11px] text-zinc-600 ml-0.5">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Skills Badges */}
      <div>
        {currentSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {currentSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-50 text-zinc-800 border border-zinc-200/90 text-xs font-mono"
              >
                <span className="text-zinc-600">#</span>
                <span className="capitalize">{skill}</span>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-zinc-600 text-xs italic bg-zinc-50 rounded-lg border border-dashed border-zinc-200">
            No items detected in this category.
          </div>
        )}
      </div>

      {/* Job Description Alignment */}
      {hasJobMatch && (
        <div className="pt-4 border-t border-zinc-100 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-xs text-zinc-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-600" />
              <span>Target Role Skill Alignment</span>
            </h4>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {jobMatchResults.matchingSkills?.length || 0} / {jobMatchResults.totalJdSkillsCount || 0} Matched
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Matching Skills */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-emerald-800">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Matched Skills in Resume
                </span>
                <span className="font-mono text-zinc-600">({jobMatchResults.matchingSkills?.length || 0})</span>
              </div>
              {jobMatchResults.matchingSkills?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {jobMatchResults.matchingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-white text-emerald-800 border border-emerald-200"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-600 italic">No direct keyword overlap with listed technologies.</p>
              )}
            </div>

            {/* Missing Skills */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-rose-800">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Plus className="w-3.5 h-3.5 text-rose-600" />
                  Missing Skills (In Job Description)
                </span>
                <span className="font-mono text-zinc-600">({jobMatchResults.skillsToDevelop?.length || 0})</span>
              </div>
              {jobMatchResults.skillsToDevelop?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {jobMatchResults.skillsToDevelop.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-white text-rose-800 border border-rose-200"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-700 font-medium">All key technical skills found in resume.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
