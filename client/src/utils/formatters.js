export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getScoreColor = (score) => {
  if (score >= 85) return '#10b981'; // Emerald 500
  if (score >= 70) return '#3b82f6'; // Blue 500
  if (score >= 50) return '#f59e0b'; // Amber 500
  return '#ef4444'; // Red 500
};

export const getScoreLabel = (score) => {
  if (score >= 85) return { label: 'Excellent ATS Match', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
  if (score >= 70) return { label: 'Strong & Competitive', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' };
  if (score >= 50) return { label: 'Needs Optimization', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
  return { label: 'Critical ATS Issues', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' };
};

export const getScoreBadgeClass = (score) => {
  if (score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 70) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (score >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
};
