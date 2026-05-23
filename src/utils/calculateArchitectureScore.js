export function calculateArchitectureScore(categoryScores) {
  const values = Object.values(categoryScores);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function getScoreTone(score) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'danger';
}
