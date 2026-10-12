const { isDbConnected } = require('../config/db');
const { checkOllamaStatus } = require('../config/aiConfig');

const getHealthStatus = async (req, res) => {
  const dbConnected = isDbConnected();
  const ollamaStatus = await checkOllamaStatus();

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Resume Analyzer API',
    database: {
      connected: dbConnected,
      mode: dbConnected ? 'MongoDB Atlas / Local' : 'In-Memory Graceful Mode',
      message: dbConnected
        ? 'Database connected. History persistence active.'
        : 'MongoDB not connected. Session history active without database storage.',
    },
    aiEngine: {
      available: ollamaStatus.available,
      mode: ollamaStatus.available ? 'Ollama Local LLM' : 'Rule-Based Heuristic Engine',
      model: ollamaStatus.activeModel || null,
      baseURL: ollamaStatus.baseURL,
      message: ollamaStatus.available
        ? `Connected to Ollama using model '${ollamaStatus.activeModel}'.`
        : 'Ollama is offline. Analyzer operates with full functionality via rule-based engine.',
    },
  });
};

module.exports = {
  getHealthStatus,
};
