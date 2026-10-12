const { SKILL_CATEGORIES, ALL_SKILLS } = require('../utils/skillDictionary');
const { ACTION_VERBS } = require('../utils/actionVerbs');

/**
 * Normalizes text for regex searches
 */
const normalizeText = (text) => text.toLowerCase();

/**
 * Extracts candidate contact information
 */
const extractContactInfo = (text) => {
  const contact = {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    location: '',
  };

  // Email regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) contact.email = emailMatch[0];

  // Phone regex (international & US formats)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) contact.phone = phoneMatch[0];

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) contact.linkedin = `https://${linkedinMatch[0]}`;

  // GitHub
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) contact.github = `https://${githubMatch[0]}`;

  // Portfolio or personal website
  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:dev|me|io|portfolio|tech|app)(?:\/[^\s]*)?/i);
  if (portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github')) {
    contact.portfolio = portfolioMatch[0];
  }

  // Candidate Name extraction heuristic (first non-empty lines, looking for capitalized words without labels)
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    // Check if line looks like a name: 2 to 4 capitalized words, no email/phone/url characters
    if (
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('linkedin') &&
      !line.includes('resume') &&
      !line.includes('curriculum') &&
      /^[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3}$/.test(line)
    ) {
      contact.name = line;
      break;
    }
  }

  // Fallback if no exact capitalized match: take the first concise line without symbols
  if (!contact.name && lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 40 && !firstLine.includes('@') && !firstLine.includes('http')) {
      contact.name = firstLine;
    }
  }

  return contact;
};

/**
 * Detects common resume sections
 */
const detectSections = (text) => {
  const lowerText = normalizeText(text);
  const detected = [];

  const sectionPatterns = {
    'Work Experience': /(?:work\s+experience|professional\s+experience|employment\s+history|experience|career\s+history|internships?)/i,
    'Education': /(?:education|academic\s+background|degrees|academic\s+credentials|qualifications)/i,
    'Skills': /(?:skills|technical\s+skills|core\s+competencies|technologies|tech\s+stack|proficiencies)/i,
    'Projects': /(?:projects|key\s+projects|technical\s+projects|personal\s+projects|portfolio\s+projects)/i,
    'Certifications': /(?:certifications?|licenses?|credentials|courses|training\s+courses|professional\s+certifications)/i,
    'Summary': /(?:professional\s+summary|summary|profile|about\s+me|career\s+objective|objective)/i,
    'Awards & Achievements': /(?:awards|achievements|honors|accomplishments|publications|recognition)/i,
  };

  for (const [section, pattern] of Object.entries(sectionPatterns)) {
    if (pattern.test(lowerText)) {
      detected.push(section);
    }
  }

  return detected;
};

/**
 * Extracts skills by category from resume text
 */
const extractSkills = (text) => {
  const lowerText = normalizeText(text);
  const identifiedSkills = {
    frontend: [],
    backend: [],
    databases: [],
    cloud_devops: [],
    ai_data: [],
    mobile: [],
    methodologies_tools: [],
    soft_skills: [],
    all: [],
  };

  const foundSet = new Set();

  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    for (const skill of skills) {
      // Escape skill for regex boundary
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Word boundary match
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
      if (regex.test(lowerText)) {
        if (!foundSet.has(skill)) {
          foundSet.add(skill);
          identifiedSkills[category].push(skill);
          identifiedSkills.all.push(skill);
        }
      }
    }
  }

  return identifiedSkills;
};

/**
 * Finds action verbs and quantifiable metrics
 */
const extractMetricsAndVerbs = (text) => {
  const lowerText = normalizeText(text);
  const foundVerbs = [];
  const verbSet = new Set();

  for (const verb of ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(lowerText)) {
      if (!verbSet.has(verb)) {
        verbSet.add(verb);
        foundVerbs.push(verb);
      }
    }
  }

  // Regex for quantifiable metrics: percentages, dollar values, multipliers, large numbers
  const metricRegexes = [
    /\b\d+(?:\.\d+)?%\b/g, // 25%, 3.5%
    /\$\s*\d+(?:,\d+)*(?:\.\d+)?(?:\s*(?:k|m|million|billion|k\b))?/gi, // $50K, $1.2M
    /\b\d+\s*\+\s*(?:users|clients|customers|downloads|endpoints|servers|services|repos|queries|requests)\b/gi,
    /\b(?:increased|reduced|decreased|accelerated|improved|saved|optimized|scaled)\s+(?:by\s+)?\d+/gi,
    /\b\d+x\b/gi, // 10x, 2x faster
    /\b(?:latency|response\s+time|load\s+time)\s+(?:reduced\s+by\s+)?\d+\s*(?:ms|seconds|%)/gi,
  ];

  let metricMatches = [];
  for (const regex of metricRegexes) {
    const matches = text.match(regex);
    if (matches) {
      metricMatches = metricMatches.concat(matches);
    }
  }

  return {
    actionVerbs: foundVerbs,
    actionVerbCount: foundVerbs.length,
    quantifiedMetrics: Array.from(new Set(metricMatches)),
    quantifiedMetricsCount: Array.from(new Set(metricMatches)).length,
  };
};

/**
 * Core ATS Scoring and Analysis Engine
 * Calculates an explainable ATS score out of 100 based on standard industry criteria
 */
const analyzeResume = (extractedText, originalFilename) => {
  const contact = extractContactInfo(extractedText);
  const detectedSections = detectSections(extractedText);
  const skills = extractSkills(extractedText);
  const metrics = extractMetricsAndVerbs(extractedText);

  const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
  const bulletPointCount = (extractedText.match(/^[\s]*[•\-*▪–—]\s+/gm) || []).length;

  // 1. Contact Information Score (Max 10)
  let contactScore = 0;
  if (contact.email) contactScore += 3;
  if (contact.phone) contactScore += 3;
  if (contact.linkedin) contactScore += 2;
  if (contact.github || contact.portfolio) contactScore += 2;
  contactScore = Math.min(10, contactScore);

  // 2. Section Completeness Score (Max 15)
  let sectionScore = 0;
  if (detectedSections.includes('Work Experience')) sectionScore += 4;
  if (detectedSections.includes('Education')) sectionScore += 3;
  if (detectedSections.includes('Skills')) sectionScore += 3;
  if (detectedSections.includes('Projects')) sectionScore += 3;
  if (detectedSections.includes('Summary')) sectionScore += 1;
  if (detectedSections.includes('Certifications')) sectionScore += 1;
  sectionScore = Math.min(15, sectionScore);

  // 3. Technical Skills Score (Max 20)
  let skillsScore = 0;
  const techSkillCount = skills.all.filter((s) => !SKILL_CATEGORIES.soft_skills.includes(s)).length;
  if (techSkillCount >= 15) skillsScore = 20;
  else if (techSkillCount >= 10) skillsScore = 17;
  else if (techSkillCount >= 6) skillsScore = 13;
  else if (techSkillCount >= 3) skillsScore = 8;
  else skillsScore = Math.min(20, techSkillCount * 2);

  // 4. Experience & Quantifiable Achievements (Max 20)
  let experienceScore = 0;
  if (detectedSections.includes('Work Experience')) experienceScore += 5;
  // Action verbs contribution (up to 8 points)
  if (metrics.actionVerbCount >= 12) experienceScore += 8;
  else if (metrics.actionVerbCount >= 7) experienceScore += 6;
  else if (metrics.actionVerbCount >= 3) experienceScore += 4;
  else experienceScore += Math.min(8, metrics.actionVerbCount);
  // Quantifiable metrics contribution (up to 7 points)
  if (metrics.quantifiedMetricsCount >= 5) experienceScore += 7;
  else if (metrics.quantifiedMetricsCount >= 3) experienceScore += 5;
  else if (metrics.quantifiedMetricsCount >= 1) experienceScore += 3;
  experienceScore = Math.min(20, experienceScore);

  // 5. Projects Section Score (Max 10)
  let projectsScore = 0;
  if (detectedSections.includes('Projects')) {
    projectsScore += 6;
    if (contact.github || contact.portfolio) projectsScore += 2;
    if (skills.all.length >= 5) projectsScore += 2;
  } else {
    // If no distinct projects section but good experience
    projectsScore = detectedSections.includes('Work Experience') ? 4 : 2;
  }
  projectsScore = Math.min(10, projectsScore);

  // 6. Education Score (Max 10)
  let educationScore = 0;
  if (detectedSections.includes('Education')) {
    educationScore += 8;
    // Check for specific degree or GPA indicators
    if (/(?:bachelor|master|b\.s|m\.s|phd|degree|computer science|engineering|gpa)/i.test(extractedText)) {
      educationScore += 2;
    }
  }
  educationScore = Math.min(10, educationScore);

  // 7. Certifications Score (Max 5)
  let certScore = 0;
  if (detectedSections.includes('Certifications')) {
    certScore = 5;
  } else if (/(?:certified|certification|credential|aws|azure|gcp|comptia)/i.test(extractedText)) {
    certScore = 3;
  } else {
    certScore = 1;
  }
  certScore = Math.min(5, certScore);

  // 8. Readability & ATS Formatting (Max 10)
  let readabilityScore = 10;
  // Word count check
  if (wordCount < 250) readabilityScore -= 3;
  else if (wordCount > 1500) readabilityScore -= 2;
  // Bullet point structure
  if (bulletPointCount < 5) readabilityScore -= 2;
  // Check for excessive characters per line or formatting
  readabilityScore = Math.max(2, Math.min(10, readabilityScore));

  const totalAtsScore = Math.round(
    contactScore +
    sectionScore +
    skillsScore +
    experienceScore +
    projectsScore +
    educationScore +
    certScore +
    readabilityScore
  );

  // Generate Strengths grounded purely in actual document contents
  const strengths = [];
  if (contact.email && contact.phone) {
    strengths.push('Essential contact information (email & phone) is clearly present and parseable.');
  }
  if (contact.linkedin) {
    strengths.push('LinkedIn profile link is included, enhancing recruiter credibility and verification.');
  }
  if (contact.github || contact.portfolio) {
    strengths.push('Project repository or portfolio link is present, providing concrete proof of work.');
  }
  if (skills.all.length >= 8) {
    strengths.push(`Rich technical skills footprint with ${skills.all.length} recognized skills identified across categories.`);
  }
  if (metrics.actionVerbCount >= 8) {
    strengths.push(`Strong active voice with ${metrics.actionVerbCount} distinct power action verbs (e.g., ${metrics.actionVerbs.slice(0, 4).join(', ')}).`);
  }
  if (metrics.quantifiedMetricsCount >= 2) {
    strengths.push(`Includes quantifiable business impact (${metrics.quantifiedMetrics.slice(0, 3).join(', ')}), which catches recruiter attention.`);
  }
  if (detectedSections.includes('Work Experience') && detectedSections.includes('Education')) {
    strengths.push('Standard ATS section hierarchy is well followed with both Experience and Education sections present.');
  }
  if (strengths.length === 0) {
    strengths.push('Resume document has clean readable text layout suitable for standard document parsers.');
  }

  // Generate Weaknesses & Missing Info grounded strictly in document content
  const weaknesses = [];
  const missingInformation = [];

  if (!contact.linkedin) {
    weaknesses.push('No LinkedIn profile URL found. Most modern tech recruiters look for your LinkedIn profile.');
    missingInformation.push('LinkedIn Profile URL');
  }
  if (!contact.github && !contact.portfolio) {
    weaknesses.push('No GitHub, GitLab, or portfolio URL detected to showcase technical proof of work.');
    missingInformation.push('GitHub / Portfolio URL');
  }
  if (!detectedSections.includes('Projects')) {
    weaknesses.push('No dedicated Projects section found. Projects demonstrate hands-on application of your skills.');
    missingInformation.push('Dedicated Projects Section');
  }
  if (!detectedSections.includes('Certifications')) {
    weaknesses.push('No Certifications section detected. Certifications validate continuous learning and domain mastery.');
    missingInformation.push('Certifications or Specialized Credentials');
  }
  if (!detectedSections.includes('Summary')) {
    weaknesses.push('Missing a concise Professional Summary at the top to quickly hook hiring managers.');
    missingInformation.push('Professional Summary / Executive Profile');
  }
  if (metrics.quantifiedMetricsCount < 3) {
    weaknesses.push('Few or no quantifiable metrics (%, $, numbers) found in work experience. ATS systems and hiring managers favor data-backed achievements.');
  }
  if (metrics.actionVerbCount < 6) {
    weaknesses.push('Low frequency of power action verbs. Experience bullets may read like job descriptions rather than proactive achievements.');
  }
  if (wordCount < 300) {
    weaknesses.push(`Resume word count is low (${wordCount} words). A standard 1-page resume typically contains 400 to 700 words.`);
  } else if (wordCount > 1300) {
    weaknesses.push(`Resume word count is quite high (${wordCount} words). Consider condensing to keep it within a concise 1-2 page standard.`);
  }

  // Actionable Improvement Tips
  const improvementTips = [
    'Use the Google "X-Y-Z" formula for bullet points: "Accomplished [X] as measured by [Y], by doing [Z]".',
    'Begin every bullet point in your experience section with a high-impact past-tense action verb.',
    'Mirror keywords from target job descriptions directly in your Skills and Summary sections.',
    'Keep formatting simple: avoid multi-column tables, text boxes, or embedded graphics that can confuse legacy ATS parsers.',
  ];

  // Specific Project Tips
  const projectTips = [
    'For each project, explicitly state the Problem, your Solution, and the Tech Stack utilized.',
    'Provide active live demo or GitHub links for your top 2-3 most substantial projects.',
    'Highlight architecture decisions (e.g., "Implemented caching with Redis reducing latency by 45%").'
  ];

  // Specific Achievement Tips
  const achievementTips = [
    'Turn passive statements ("Responsible for testing APIs") into results-driven statements ("Engineered automated test suite covering 94% of API endpoints").',
    'Quantify scope: specify team sizes collaborated with, monthly active users supported, or deployment frequencies achieved.',
    'Include business context: how did your code save time, prevent bugs, or increase user satisfaction?'
  ];

  return {
    atsScore: totalAtsScore,
    categoryScores: {
      contactInfo: Math.round((contactScore / 10) * 100),
      sectionCompleteness: Math.round((sectionScore / 15) * 100),
      technicalSkills: Math.round((skillsScore / 20) * 100),
      experience: Math.round((experienceScore / 20) * 100),
      projects: Math.round((projectsScore / 10) * 100),
      education: Math.round((educationScore / 10) * 100),
      certifications: Math.round((certScore / 5) * 100),
      readability: Math.round((readabilityScore / 10) * 100),
    },
    rawCategoryPoints: {
      contactInfo: { score: contactScore, max: 10 },
      sectionCompleteness: { score: sectionScore, max: 15 },
      technicalSkills: { score: skillsScore, max: 20 },
      experience: { score: experienceScore, max: 20 },
      projects: { score: projectsScore, max: 10 },
      education: { score: educationScore, max: 10 },
      certifications: { score: certScore, max: 5 },
      readability: { score: readabilityScore, max: 10 },
    },
    extractedData: {
      contact,
      detectedSections,
      identifiedSkills: skills,
      wordCount,
      bulletPointCount,
      characterCount: extractedText.length,
    },
    analysisResults: {
      strengths,
      weaknesses,
      missingInformation,
      improvementTips,
      projectTips,
      achievementTips,
      actionVerbs: metrics.actionVerbs,
      actionVerbCount: metrics.actionVerbCount,
      quantifiedMetrics: metrics.quantifiedMetrics,
      quantifiedMetricsCount: metrics.quantifiedMetricsCount,
    },
    disclaimer: 'This ATS score is an estimate calculated by analyzing industry resume benchmarks and parsing heuristics. It is not an official score issued by a specific ATS provider.',
  };
};

module.exports = {
  analyzeResume,
  extractContactInfo,
  detectSections,
  extractSkills,
  extractMetricsAndVerbs,
};
