# ResumeAI Pro — Intelligent ATS Resume Analyzer & Job Matcher

A complete, full-stack web application built from scratch to analyze resumes, benchmark against target job descriptions, calculate an explainable ATS compatibility estimate, and provide actionable improvements and bullet point rewrites.

![ResumeAI Pro Banner](https://img.shields.io/badge/ATS-Resume%20Analyzer-indigo)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-v20%2B-green)
![React](https://img.shields.io/badge/React-v18-cyan)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

---

## 🌟 Key Features

1. **Multi-Format Resume Text Extraction**
   - Direct parsing of text from **PDF** (`pdf-parse`) and **Word DOCX** (`mammoth`) documents.
   - Validation that catches scanned/image-only documents or empty files and provides actionable feedback.
   - Safe in-memory processing with Multer: resume files are never permanently kept on disk by default.

2. **Explainable ATS Compatibility Engine (0–100 Score)**
   - Industry-benchmark ATS scoring across 8 core dimensions:
     - Contact information completeness (Email, Phone, LinkedIn, GitHub, Portfolio)
     - Standard section hierarchy (Experience, Education, Skills, Projects, Summary, Certifications)
     - Technical skills density across frontend, backend, databases, cloud/devops, and AI
     - Action verbs frequency (using an extensive catalog of active power verbs)
     - Quantifiable impact metrics (percentages, dollar amounts, scale multipliers)
     - Hands-on project depth
     - Academic qualifications & GPA
     - Readability, word count distribution, and ATS bullet formatting
   - *Note: Clearly labeled as an algorithmic estimate, never misrepresented as an official score from an ATS vendor.*

3. **Job Description Matching & Gap Analysis**
   - Paste any target job posting to benchmark alignment.
   - Computes weighted match percentage.
   - Highlights matching technical skills and keywords in the resume.
   - Uncovers missing high-frequency keywords and skills to develop.
   - Generates tailored resume bullet alignment suggestions.

4. **AI Integration with Dual-Engine Architecture**
   - **Local AI with Ollama**: Connects to local models (e.g., `llama3.2`, `mistral`, `gemma2`) when Ollama is running at `http://localhost:11434`.
   - **Deterministic Rule-Based Fallback**: Works **100% out of the box** without any paid OpenAI API keys or local LLM setup.
   - Transparent indicators show which engine generated the analysis (never pretending fallback text came from an LLM).
   - Generates tailored executive summaries and Google X-Y-Z bullet rewrites (*"Accomplished [X] as measured by [Y], by doing [Z]"*).

5. **MongoDB Persistence with In-Memory Graceful Mode**
   - Automatically saves analysis history to MongoDB when configured via Mongoose.
   - If MongoDB is disconnected, operates smoothly in **session in-memory mode** so all core features remain functional.

6. **Executive PDF Audit Report Download**
   - Download professionally formatted, printable PDF reports containing the full ATS audit, charts, strengths, gaps, and rewritten bullet points.
   - Dual export pipeline: backend PDF generation via `pdfkit` and instantaneous client-side export via `jsPDF`.

---

## 📂 Project Architecture

```
resume-analyzer/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets & SVG favicon
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── BulletComparison.jsx
│   │   │   ├── CategoryScoreChart.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ScoreGauge.jsx
│   │   │   ├── SkillsDisplay.jsx
│   │   │   ├── StatusBanner.jsx
│   │   │   └── StrengthsWeaknesses.jsx
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx  # Layout shell with Navbar & Banner
│   │   ├── pages/
│   │   │   ├── AnalyzerPage.jsx# Drag & drop upload & JD form
│   │   │   ├── HistoryPage.jsx # Past analyses & delete
│   │   │   ├── LandingPage.jsx # Hero, features, FAQ
│   │   │   └── ResultsPage.jsx # ATS scores, charts, PDF export
│   │   ├── services/
│   │   │   ├── api.js          # Axios API communication
│   │   │   └── pdfExport.js    # Client jsPDF fallback
│   │   ├── utils/
│   │   │   ├── constants.js    # Sample JDs & endpoints
│   │   │   └── formatters.js   # Score colors & date formatters
│   │   ├── App.jsx             # React Router DOM configuration
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.jsx            # React root entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   ├── aiConfig.js         # Ollama connectivity & model detection
│   │   └── db.js               # MongoDB Mongoose & in-memory fallback
│   ├── controllers/
│   │   ├── analyzeController.js# Upload, parsing, scoring, export
│   │   ├── healthController.js # Health check & system diagnostics
│   │   └── historyController.js# Query & delete audit records
│   ├── middleware/
│   │   ├── errorHandler.js     # Centralized error handler
│   │   └── uploadMiddleware.js # Multer file validation (10MB, PDF/DOCX)
│   ├── models/
│   │   └── AnalysisHistory.js  # Mongoose schema for saved analyses
│   ├── routes/
│   │   └── api.js              # Express REST API routes
│   ├── services/
│   │   ├── aiService.js        # Ollama LLM / Rule-based prompt engine
│   │   ├── analysisEngine.js   # 8-dimension ATS scoring engine
│   │   ├── jobMatchService.js  # Job description keyword & skill matcher
│   │   ├── parserService.js    # pdf-parse & mammoth text extraction
│   │   └── pdfService.js       # PDFKit report generation
│   ├── utils/
│   │   ├── actionVerbs.js      # ATS power action verbs dictionary
│   │   └── skillDictionary.js  # Categorized technical skills taxonomy
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express application entrypoint
│
├── README.md
└── .gitignore
```

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 & Vite
  - Tailwind CSS (SaaS design system)
  - React Router DOM v6
  - Axios
  - Lucide React icons
  - Recharts (responsive bar and metrics visualization)
  - jsPDF & jsPDF-autotable (client-side export)

- **Backend**:
  - Node.js & Express.js
  - Multer (in-memory file upload handling)
  - `pdf-parse` (PDF text extraction)
  - `mammoth` (Word .docx text extraction)
  - `pdfkit` (backend report generation)
  - CORS, Dotenv

- **Database**:
  - MongoDB Atlas or Local MongoDB
  - Mongoose
  - Graceful in-memory fallback if no database is running

- **AI & NLP**:
  - Local Ollama LLM integration (`http://localhost:11434`)
  - Rule-based algorithmic heuristic engine (zero paid API dependencies)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **npm** v9+
- *(Optional)* **MongoDB** running locally or a MongoDB Atlas URI
- *(Optional)* **Ollama** running locally (`ollama run llama3.2`)

---

### 2. Backend Setup

Open a terminal and navigate to `server/`:

```bash
cd server
npm install
```

Create your `.env` file (you can copy `.env.example`):

```bash
cp .env.example .env
```

Config variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resume_analyzer
CLIENT_URL=http://localhost:5173
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Start the backend:

```bash
npm start
# or with auto-reload:
npm run dev
```

You should see:
```
✅ Connected successfully to MongoDB (or running in fallback mode)
🚀 AI Resume Analyzer API running on port 5000
📡 Health Check: http://localhost:5000/api/health
```

---

### 3. Frontend Setup

In a new terminal window, navigate to `client/`:

```bash
cd client
npm install
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check, DB connection status, and AI engine mode |
| `POST` | `/api/analyze` | Multipart upload (`resume` file + optional `jobDescription`) |
| `POST` | `/api/match-job` | Match resume text against a target job description |
| `POST` | `/api/export-pdf` | Stream a formatted PDF ATS audit report |
| `GET` | `/api/history` | List all previous resume audits |
| `GET` | `/api/history/:id` | Get full details of a specific audit |
| `DELETE` | `/api/history/:id` | Delete an audit record |

---

## 🤖 Configuring Optional Local AI (Ollama)

1. Download and install [Ollama](https://ollama.ai/).
2. Pull and start a local model:
   ```bash
   ollama run llama3.2
   ```
3. The server will automatically detect that Ollama is online at `http://localhost:11434` and enhance bullet rewrites and executive summaries with local AI.
4. If Ollama is offline or not installed, the application automatically uses its built-in rule-based analysis engine without any error or downtime!

---

## 📄 License
MIT License. Built from scratch with clean, modern full-stack practices.
