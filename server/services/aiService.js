const axios = require('axios');
const { getOllamaConfig, checkOllamaStatus } = require('../config/aiConfig');

/**
 * Generates rule-based bullet improvements and summary when Ollama is offline
 */
const generateRuleBasedEnhancements = (resumeText, analysis, jobMatch) => {
  const topSkills = analysis.extractedData?.identifiedSkills?.all?.slice(0, 5).join(', ') || 'modern software technologies';
  const role = jobMatch?.detectedRole || 'Software Professional';
  const candidateName = analysis.extractedData?.contact?.name || 'Results-driven candidate';

  // Extract sample bullet lines from text
  const lines = resumeText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 25 && l.length < 180 && !l.includes('@') && !l.includes('http'));

  const sampleOriginal = lines.length > 0 ? lines[0] : 'Responsible for developing backend web application features and bug fixes.';
  const sampleOriginal2 = lines.length > 1 ? lines[1] : 'Worked on frontend components using React and improved performance.';

  return {
    aiEnhanced: false,
    engine: 'rule-based',
    model: null,
    statusNote: 'Rule-based analysis engine utilized. Ollama local LLM service is offline or unconfigured.',
    executiveSummary: `Accomplished ${role} with proven expertise in ${topSkills}. Track record of architecting scalable applications, optimizing workflow efficiency, and delivering measurable business impact in collaborative agile environments.`,
    bulletImprovements: [
      {
        original: sampleOriginal,
        improved: `Architected and deployed high-performance features utilizing ${topSkills}, cutting issue turnaround time by 35% and enhancing system reliability.`,
        reasoning: 'Replaced passive phrasing with the active verb "Architected" and added quantifiable metric of 35% improvement according to Google XYZ standards.',
      },
      {
        original: sampleOriginal2,
        improved: `Engineered reusable component architecture that accelerated team delivery speed by 28% and decreased client load latency.`,
        reasoning: 'Highlights business value and engineering initiative instead of general job responsibilities.',
      },
    ],
    customizedRecommendations: [
      'Begin every bullet point in your Experience section with past-tense action verbs (e.g., Architected, Optimized, Spearheaded).',
      'Infuse measurable key performance indicators (KPIs, percentages, dollar value, user volume) into your achievements.',
      jobMatch?.hasJobMatch
        ? `Incorporate matching keywords prominently: ${jobMatch.matchingKeywords.slice(0, 4).join(', ')}.`
        : 'Align resume keywords closely with the specific job description for maximum ATS relevance.',
      'Maintain clean single-column hierarchy for optimal automated parsing compatibility.',
    ],
  };
};

/**
 * Calls Ollama local LLM when available, otherwise falls back gracefully
 */
const getAIEnhancedFeedback = async (resumeText, analysis, jobMatch) => {
  const ollamaStatus = await checkOllamaStatus();

  if (!ollamaStatus.available) {
    return generateRuleBasedEnhancements(resumeText, analysis, jobMatch);
  }

  const modelToUse = ollamaStatus.activeModel || 'llama3.2';
  const config = getOllamaConfig();

  const prompt = `
You are an expert ATS Resume Coach and Technical Recruiter.
Analyze this resume text and provide concise, high-impact improvements.

Resume Text (excerpts):
"""
${resumeText.slice(0, 2500)}
"""

${jobMatch?.hasJobMatch ? `Target Job Description:\n"""\n${jobMatch.jobDescription ? jobMatch.jobDescription.slice(0, 1500) : ''}\n"""` : ''}

Detected ATS Score: ${analysis.atsScore}/100
Top Skills: ${analysis.extractedData?.identifiedSkills?.all?.slice(0, 8).join(', ')}

Return a strict JSON object with this EXACT structure (no markdown fences, no extra text):
{
  "executiveSummary": "A concise 2-3 sentence recruiter-ready executive summary tailored to candidate's skills",
  "bulletImprovements": [
    {
      "original": "An actual weak bullet point found or adapted from the resume",
      "improved": "High-impact rewrite following Google XYZ formula (Accomplished [X] measured by [Y] doing [Z])",
      "reasoning": "Brief explanation of why this rewrite works better for ATS and hiring managers"
    }
  ],
  "customizedRecommendations": [
    "Specific actionable tip 1",
    "Specific actionable tip 2",
    "Specific actionable tip 3"
  ]
}
`.trim();

  try {
    const response = await axios.post(
      `${config.baseURL}/api/generate`,
      {
        model: modelToUse,
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.3,
          num_predict: 600,
        },
      },
      { timeout: 15000 }
    );

    const rawResponse = response.data?.response;
    if (!rawResponse) {
      throw new Error('Empty response from Ollama');
    }

    const parsed = JSON.parse(rawResponse);
    return {
      aiEnhanced: true,
      engine: 'ollama',
      model: modelToUse,
      statusNote: `AI feedback generated locally via Ollama (${modelToUse})`,
      executiveSummary: parsed.executiveSummary || '',
      bulletImprovements: parsed.bulletImprovements || [],
      customizedRecommendations: parsed.customizedRecommendations || [],
    };
  } catch (err) {
    console.warn(`Ollama call failed (${err.message}). Falling back to rule-based engine.`);
    const fallback = generateRuleBasedEnhancements(resumeText, analysis, jobMatch);
    fallback.ollamaError = err.message;
    return fallback;
  }
};

module.exports = {
  getAIEnhancedFeedback,
  generateRuleBasedEnhancements,
};
