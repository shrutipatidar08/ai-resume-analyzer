import React, { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';

export const LoadingState = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Parsing document text-layer & metadata...',
    'Extracting technical skills & action verbs...',
    'Evaluating section hierarchy & contact completeness...',
    'Calculating keyword overlap against target job description...',
    'Formulating Google X-Y-Z experience rewrites...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-xs max-w-md mx-auto text-center space-y-6">
      {/* Spinner */}
      <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mx-auto">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-800" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-zinc-950 tracking-tight">
          Processing Document
        </h3>
        <p className="text-xs text-zinc-500 font-mono">
          Running ATS compatibility heuristics
        </p>
      </div>

      {/* Progress steps */}
      <div className="space-y-2 text-left pt-2 font-mono text-xs border-t border-zinc-100">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 transition-colors ${
                isDone
                  ? 'text-zinc-800'
                  : isCurrent
                  ? 'text-zinc-950 font-semibold'
                  : 'text-zinc-400'
              }`}
            >
              <span className="w-4 text-center shrink-0">
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 inline" />
                ) : isCurrent ? (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse" />
                ) : (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-300" />
                )}
              </span>
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
