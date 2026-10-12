import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ArrowRight,
  Shield,
  Check,
  Search,
  Download,
  Terminal,
  Layers,
  ChevronDown,
  Cpu,
  Award,
  Zap,
  Target,
  FileCheck,
} from 'lucide-react';

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: <Award className="w-5 h-5 text-blue-600" />,
      badgeBg: 'bg-blue-50 border-blue-200 text-blue-600',
      title: 'Deterministic ATS Compatibility',
      desc: 'Transparent 0–100 score computed across 8 benchmarks: contact details, section hierarchy, skills footprint, metrics, and readability.',
    },
    {
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      title: 'Target Role Keyword Gap Analysis',
      desc: 'Compares your resume text against any job posting to pinpoint missing technical skills and high-frequency recruiter terms.',
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-600',
      title: 'Google X-Y-Z Bullet Rewrites',
      desc: 'Transforms passive duty descriptions into structured achievements: Accomplished [X] as measured by [Y] by doing [Z].',
    },
    {
      icon: <FileCheck className="w-5 h-5 text-emerald-600" />,
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      title: 'Multi-Format Text Extraction',
      desc: 'Native parsing of selectable PDF and Word (.docx) documents with graceful validation for scanned or image-only files.',
    },
    {
      icon: <Shield className="w-5 h-5 text-sky-600" />,
      badgeBg: 'bg-sky-50 border-sky-200 text-sky-600',
      title: 'Zero Permanent Storage',
      desc: 'Files are processed in memory and never permanently stored by default. Pure privacy-first local architecture.',
    },
    {
      icon: <Download className="w-5 h-5 text-purple-600" />,
      badgeBg: 'bg-purple-50 border-purple-200 text-purple-600',
      title: 'Executive PDF Audit Reports',
      desc: 'Download a clean, printable PDF audit summarizing ATS scores, category breakdowns, and recommended bullet improvements.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Upload Document',
      desc: 'Select a text-based PDF or DOCX resume. Files are parsed in memory without permanent disk storage.',
    },
    {
      num: '02',
      title: 'Add Job Description',
      desc: 'Paste your target job posting to benchmark keyword overlap, missing skills, and role alignment.',
    },
    {
      num: '03',
      title: 'Review Audit',
      desc: 'Inspect category scores, detected skills, quantifiable metric frequency, and critical gaps.',
    },
    {
      num: '04',
      title: 'Export Report',
      desc: 'Review Google X-Y-Z bullet rewrites and export a clean PDF diagnostic report for reference.',
    },
  ];

  const faqs = [
    {
      q: 'What is an ATS and why does this score matter?',
      a: 'An Applicant Tracking System (ATS) is software used by employers to parse, index, and filter candidate resumes. If a resume lacks standard section headings, technical keywords, or clean formatting, it can be filtered out before a recruiter reviews it. Our analyzer evaluates your resume against these core parsing standards.',
    },
    {
      q: 'Is this an official score from an ATS provider?',
      a: 'No. There is no single universal ATS algorithm; systems vary across Workday, Greenhouse, Lever, and iCIMS. Our score is an algorithmic estimate based on industry resume benchmarks, action verb density, and keyword overlap.',
    },
    {
      q: 'Does this require paid API keys?',
      a: 'No. ResumeAI Pro includes a full deterministic rule-based analysis engine that runs 100% out of the box with zero external dependencies. If you have Ollama installed locally, you can optionally connect a local open-source LLM (such as llama3.2) at zero cost.',
    },
    {
      q: 'What file formats are supported?',
      a: 'We accept text-selectable PDF (.pdf) and Microsoft Word (.docx / .doc) documents up to 10 MB in size.',
    },
    {
      q: 'Are my resumes saved or shared?',
      a: 'No. Document files are processed in memory during parsing and are discarded immediately afterward. Only structured diagnostic metrics are stored in your local session history.',
    },
  ];

  return (
    <div className="space-y-20 pb-20 pt-8 sm:pt-14">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-mono font-medium shadow-2xs">
          <Terminal className="w-3.5 h-3.5 text-blue-600" />
          <span>Algorithmic ATS Diagnostic Engine • Free & Local</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
          Your Resume, Optimized for Your{' '}
          <span className="text-blue-600">Dream Job.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Comprehensive ATS compatibility scoring, job-description gap analysis, and Google X-Y-Z experience rewrites powered by explainable heuristics and local AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/analyze"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/25"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Upload Resume & Scan</span>
            <ArrowRight className="w-4 h-4 text-blue-200" />
          </Link>

          <Link
            to="/history"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
          >
            <span>View Past Audits</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
            No API Keys Needed
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-blue-600 font-bold" />
            PDF & DOCX Support
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
            In-Memory Processing
          </span>
        </div>
      </section>

      {/* Realistic Product Sample Preview with Color Accents */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Mock Window Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 font-medium text-slate-700">alex_morgan_resume.pdf</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold font-mono text-[11px]">
                ATS Score: 88/100
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold font-mono text-[11px]">
                JD Match: 92%
              </span>
            </div>
          </div>

          {/* Mock Content Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* 4-Stat Row with Tasteful Colorful Accents */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl">
                <span className="text-[11px] font-mono text-blue-800 uppercase font-semibold block">Contact Info</span>
                <span className="text-xl font-bold font-mono text-blue-900 mt-0.5 block">100%</span>
                <span className="text-[10px] text-blue-700 font-medium block truncate">LinkedIn & GitHub verified</span>
              </div>
              <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                <span className="text-[11px] font-mono text-indigo-800 uppercase font-semibold block">Tech Skills</span>
                <span className="text-xl font-bold font-mono text-indigo-900 mt-0.5 block">16 detected</span>
                <span className="text-[10px] text-indigo-700 font-medium block truncate">React, Node, AWS, Docker</span>
              </div>
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                <span className="text-[11px] font-mono text-emerald-800 uppercase font-semibold block">Action Verbs</span>
                <span className="text-xl font-bold font-mono text-emerald-900 mt-0.5 block">14 verbs</span>
                <span className="text-[10px] text-emerald-700 font-medium block truncate">Architected, Deployed</span>
              </div>
              <div className="p-3.5 bg-amber-50/60 border border-amber-100 rounded-xl">
                <span className="text-[11px] font-mono text-amber-800 uppercase font-semibold block">Impact Metrics</span>
                <span className="text-xl font-bold font-mono text-amber-900 mt-0.5 block">4 metrics</span>
                <span className="text-[10px] text-amber-700 font-medium block truncate">35% latency, 100K users</span>
              </div>
            </div>

            {/* Sample Diff Rewrite with Rich Contrast */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="px-3.5 py-2 bg-slate-100 border-b border-slate-200 font-mono text-[11px] text-slate-700 font-semibold flex items-center justify-between">
                <span>Sample Experience Transformation (Google X-Y-Z Standard)</span>
                <span className="text-blue-600 font-mono text-[10px]">VERIFIED ATS FORMAT</span>
              </div>
              <div className="p-3.5 bg-rose-50/70 border-b border-rose-100 text-slate-700 flex items-start gap-2.5">
                <span className="font-mono text-rose-600 font-bold shrink-0 text-sm">-</span>
                <span className="line-through decoration-rose-300 text-slate-600 leading-relaxed">
                  Responsible for developing backend web application features and resolving bug tickets.
                </span>
              </div>
              <div className="p-3.5 bg-emerald-50/70 text-slate-900 font-medium flex items-start gap-2.5">
                <span className="font-mono text-emerald-600 font-bold shrink-0 text-sm">+</span>
                <span className="leading-relaxed">
                  Architected and deployed high-performance microservices with Node.js and Redis, cutting response latency by 35% across 100K daily queries.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Vibrant Color Badges */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Core Analysis Capabilities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Engineered around verifiable resume parsing criteria and industry benchmarks.
            </p>
          </div>
          <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg self-start sm:self-auto font-semibold">
            6 Specialized Tools
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-hover transition-all space-y-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.badgeBg}`}>
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works with Rich Navy Contrast */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="pb-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-blue-400 uppercase tracking-wider font-semibold block mb-1">
                Workflow
              </span>
              <h2 className="text-xl font-bold tracking-tight">How The Audit Operates</h2>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              4 Steps
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {steps.map((st, i) => (
              <div key={i} className="space-y-2 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="font-mono text-sm font-bold text-blue-400 block">
                  {st.num}
                </span>
                <h4 className="text-sm font-bold text-white">{st.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800 text-center">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm shadow-blue-500/30"
            >
              <span>Scan Resume Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Frequently Answered Questions
          </h2>
          <p className="text-xs text-slate-500">Methodology, scoring criteria, and privacy.</p>
        </div>

        <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 bg-white overflow-hidden shadow-2xs">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="transition-colors">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-slate-900 text-xs hover:text-blue-600"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed pt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
