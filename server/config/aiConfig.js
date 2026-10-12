const axios = require('axios');

const getOllamaConfig = () => {
  return {
    baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3.2',
  };
};

const checkOllamaStatus = async () => {
  const config = getOllamaConfig();
  try {
    const response = await axios.get(`${config.baseURL}/api/tags`, {
      timeout: 2000,
    });
    const models = response.data?.models || [];
    const modelNames = models.map((m) => m.name || m.model);
    
    // Check if configured model or any model exists
    const exactMatch = modelNames.find((name) => name.startsWith(config.model));
    const activeModel = exactMatch || (modelNames.length > 0 ? modelNames[0] : config.model);

    return {
      available: true,
      baseURL: config.baseURL,
      configuredModel: config.model,
      activeModel: activeModel,
      availableModels: modelNames,
    };
  } catch (error) {
    return {
      available: false,
      baseURL: config.baseURL,
      configuredModel: config.model,
      activeModel: null,
      availableModels: [],
      error: error.message,
    };
  }
};

module.exports = {
  getOllamaConfig,
  checkOllamaStatus,
};
