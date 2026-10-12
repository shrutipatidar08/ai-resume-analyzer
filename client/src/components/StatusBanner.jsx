import React, { useState } from 'react';
import { Terminal, Database, X } from 'lucide-react';

export const StatusBanner = ({ healthStatus }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !healthStatus) return null;

  const isOllamaOffline = !healthStatus.aiEngine?.available;
  const isDbInMemory = !healthStatus.database?.connected;

  if (!isOllamaOffline && !isDbInMemory) return null;

  return (
    <div className="bg-zinc-100 border-b border-zinc-200 text-zinc-700 text-xs py-1.5 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 font-mono text-[11px]">
        <div className="flex flex-wrap items-center gap-3">
          {isOllamaOffline && (
            <div className="flex items-center gap-1.5 text-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>
                <strong>Mode:</strong> Deterministic rule engine active. (Optional local LLM: <code className="bg-white border border-zinc-200 px-1 py-0.5 rounded text-zinc-800">ollama run llama3.2</code>)
              </span>
            </div>
          )}

          {isDbInMemory && (
            <div className="flex items-center gap-1.5 text-zinc-600 border-l border-zinc-300 pl-3">
              <Database className="w-3 h-3 text-zinc-500 shrink-0" />
              <span>Session storage active (MongoDB not connected).</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-400 hover:text-zinc-700 p-0.5 transition-colors"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
