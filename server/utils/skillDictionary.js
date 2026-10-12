const SKILL_CATEGORIES = {
  frontend: [
    'react', 'react.js', 'vue', 'vue.js', 'angular', 'svelte', 'next.js', 'nuxt.js',
    'javascript', 'typescript', 'html', 'html5', 'css', 'css3', 'tailwind css',
    'bootstrap', 'sass', 'scss', 'redux', 'zustand', 'webpack', 'vite', 'responsive design',
    'material-ui', 'shadcn', 'chakra ui', 'web accessibility', 'wcag'
  ],
  backend: [
    'node.js', 'nodejs', 'express', 'express.js', 'nestjs', 'fastify', 'python',
    'django', 'fastapi', 'flask', 'java', 'spring', 'spring boot', 'c#', '.net',
    'asp.net', 'golang', 'go', 'rust', 'php', 'laravel', 'ruby', 'ruby on rails',
    'c++', 'c', 'rest api', 'restful api', 'graphql', 'microservices', 'grpc', 'websocket'
  ],
  databases: [
    'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'elasticsearch',
    'cassandra', 'dynamodb', 'firebase', 'supabase', 'oracle', 'sql server', 'mariadb',
    'prisma', 'sequelize', 'typeorm', 'mongoose', 'neo4j'
  ],
  cloud_devops: [
    'aws', 'amazon web services', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes',
    'k8s', 'terraform', 'ansible', 'jenkins', 'github actions', 'gitlab ci', 'ci/cd',
    'linux', 'ubuntu', 'nginx', 'apache', 'helm', 'prometheus', 'grafana', 'serverless',
    'lambda', 'cloudformation', 'datadog'
  ],
  ai_data: [
    'machine learning', 'deep learning', 'artificial intelligence', 'data science',
    'pytorch', 'tensorflow', 'keras', 'scikit-learn', 'pandas', 'numpy', 'scipy',
    'natural language processing', 'nlp', 'large language models', 'llm', 'langchain',
    'hugging face', 'computer vision', 'opencv', 'rag', 'data analysis', 'sql',
    'power bi', 'tableau', 'spark', 'hadoop', 'kafka', 'etl'
  ],
  mobile: [
    'react native', 'flutter', 'dart', 'swift', 'swiftui', 'kotlin', 'android',
    'ios', 'xcode', 'android studio', 'expo', 'mobile development'
  ],
  methodologies_tools: [
    'git', 'github', 'gitlab', 'bitbucket', 'agile', 'scrum', 'kanban', 'jira',
    'confluence', 'unit testing', 'jest', 'vitest', 'cypress', 'playwright', 'selenium',
    'tdd', 'bdd', 'system design', 'software architecture', 'clean code', 'design patterns'
  ],
  soft_skills: [
    'communication', 'team leadership', 'leadership', 'collaboration', 'problem solving',
    'critical thinking', 'time management', 'adaptability', 'mentorship', 'stakeholder management',
    'cross-functional', 'project management', 'analytical skills', 'work ethic', 'conflict resolution'
  ]
};

// Flattened list of all known skills for fast keyword detection
const ALL_TECHNICAL_SKILLS = [
  ...SKILL_CATEGORIES.frontend,
  ...SKILL_CATEGORIES.backend,
  ...SKILL_CATEGORIES.databases,
  ...SKILL_CATEGORIES.cloud_devops,
  ...SKILL_CATEGORIES.ai_data,
  ...SKILL_CATEGORIES.mobile,
  ...SKILL_CATEGORIES.methodologies_tools
];

const ALL_SKILLS = [
  ...ALL_TECHNICAL_SKILLS,
  ...SKILL_CATEGORIES.soft_skills
];

module.exports = {
  SKILL_CATEGORIES,
  ALL_TECHNICAL_SKILLS,
  ALL_SKILLS,
};
