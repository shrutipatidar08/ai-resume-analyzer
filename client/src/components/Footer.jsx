import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Terminal, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200/80 bg-white text-zinc-500 text-xs py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-zinc-900 tracking-tight">Resume/ats</span>
          <span className="text-zinc-300">•</span>
          <span>Algorithmic ATS Compatibility Engine</span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-400">Files parsed in-memory</span>
        </div>

        <div className="flex items-center gap-5 text-zinc-600">
          <Link to="/analyze" className="hover:text-zinc-950 transition-colors">Analyzer</Link>
          <Link to="/history" className="hover:text-zinc-950 transition-colors">History</Link>
          <span className="text-zinc-400 font-mono text-[11px]">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};
