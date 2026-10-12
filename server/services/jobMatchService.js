const { ALL_TECHNICAL_SKILLS, ALL_SKILLS, SKILL_CATEGORIES } = require('../utils/skillDictionary');

/**
 * Common stopwords to exclude from keyword extraction
 */
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in',
  'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should',
  'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d',
  'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s',
  'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you',
  'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'experience', 'years',
  'work', 'working', 'job', 'role', 'team', 'company', 'candidate', 'responsibilities', 'qualifications',
  'requirements', 'preferred', 'must', 'have', 'ability', 'strong', 'skills', 'plus', 'including', 'opportunity'
]);

/**
 * Extracts distinct keywords and technical skills from a job description
 */
const extractJobKeywords = (jobDescription) => {
  const lowerJd = jobDescription.toLowerCase();

  // 1. Detect technical and domain skills from dictionary
  const jdSkills = [];
  for (const skill of ALL_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
    if (regex.test(lowerJd)) {
      jdSkills.push(skill);
    }
  }

  // 2. Extract frequency of domain terms and multi-word phrases
  const words = lowerJd
    .replace(/[^a-zA-Z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const freqMap = {};
  for (const word of words) {
    freqMap[word] = (freqMap[word] || 0) + 1;
  }

  // Sort by frequency
  const sortedKeywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);

  return {
    jdSkills: Array.from(new Set(jdSkills)),
    jdKeywords: sortedKeywords,
  };
};

/**
 * Compares resume text with a target job description
 */
const matchResumeWithJob = (resumeText, jobDescription, resumeExtractedSkills = null) => {
  if (!jobDescription || jobDescription.trim().length < 20) {
    return {
      hasJobMatch: false,
      message: 'No job description provided for matching.',
    };
  }

  const lowerResume = resumeText.toLowerCase();
  const { jdSkills, jdKeywords } = extractJobKeywords(jobDescription);

  // Resume skills set
  const resumeSkillsSet = new Set(
    resumeExtractedSkills?.all?.map((s) => s.toLowerCase()) || []
  );

  // If no pre-extracted skills passed, extract now
  if (resumeSkillsSet.size === 0) {
    for (const skill of ALL_SKILLS) {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
      if (regex.test(lowerResume)) {
        resumeSkillsSet.add(skill.toLowerCase());
      }
    }
  }

  // Find matching and missing technical skills
  const matchingSkills = [];
  const skillsToDevelop = [];

  for (const skill of jdSkills) {
    if (resumeSkillsSet.has(skill.toLowerCase())) {
      matchingSkills.push(skill);
    } else {
      skillsToDevelop.push(skill);
    }
  }

  // Keyword match analysis
  const matchingKeywords = [];
  const missingKeywords = [];

  for (const keyword of jdKeywords) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(lowerResume)) {
      matchingKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  // Calculate Match Percentage
  let skillMatchRatio = 0.5;
  if (jdSkills.length > 0) {
    skillMatchRatio = matchingSkills.length / jdSkills.length;
  }

  let keywordMatchRatio = 0.5;
  if (jdKeywords.length > 0) {
    keywordMatchRatio = matchingKeywords.length / jdKeywords.length;
  }

  // Weighted score: 65% skills alignment, 35% general keyword presence
  const rawMatchScore = Math.round((skillMatchRatio * 0.65 + keywordMatchRatio * 0.35) * 100);
  const matchPercentage = Math.min(98, Math.max(15, rawMatchScore));

  // Determine potential job title from JD
  let detectedRole = '';
  const roleMatch = jobDescription.match(/(?:seeking|looking for|hiring|role:?|position:?|title:?)\s*(?:a|an)?\s*([A-Za-z\s]{3,35}(?:engineer|developer|architect|designer|manager|scientist|analyst|specialist|lead))/i);
  if (roleMatch && roleMatch[1]) {
    detectedRole = roleMatch[1].trim();
  }

  // Generate Tailoring Suggestions
  const tailoringSuggestions = [];
  if (skillsToDevelop.length > 0) {
    tailoringSuggestions.push(
      `Incorporate key missing skills from the job description if you have practical experience with them: ${skillsToDevelop.slice(0, 5).join(', ')}.`
    );
  }
  if (missingKeywords.length > 0) {
    tailoringSuggestions.push(
      `Mirror job description terminology: Consider weaving high-frequency keywords like "${missingKeywords.slice(0, 4).join('", "')}" into your bullet points.`
    );
  }
  tailoringSuggestions.push(
    'Tailor your Professional Summary at the top of your resume to specifically state alignment with this role and company mission.'
  );
  tailoringSuggestions.push(
    'Re-order your experience bullet points so achievements directly relevant to this job description appear near the top.'
  );

  return {
    hasJobMatch: true,
    matchPercentage,
    detectedRole,
    matchingSkills,
    skillsToDevelop,
    matchingKeywords: matchingKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 15),
    totalJdSkillsCount: jdSkills.length,
    tailoringSuggestions,
  };
};

module.exports = {
  extractJobKeywords,
  matchResumeWithJob,
};
