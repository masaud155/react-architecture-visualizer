import { getAllInteractionDiffs } from './renderMetrics.js';
import { loadWhatIfSlots } from './whatIfModel.js';

export function getRadarScores() {
  const diffs = getAllInteractionDiffs();
  const avgEfficiency = Math.round(diffs.reduce((sum, diff) => sum + diff.good.efficiency, 0) / diffs.length);
  const avgWasteSaved = Math.round(diffs.reduce((sum, diff) => sum + diff.savedWaste, 0) / diffs.length);
  const avgCostSaved = Math.round(diffs.reduce((sum, diff) => sum + diff.savedCost, 0) / diffs.length);

  return [
    { label: 'State locality', value: 88 },
    { label: 'Prop stability', value: 82 },
    { label: 'Context safety', value: 76 },
    { label: 'Render efficiency', value: avgEfficiency },
    { label: 'List isolation', value: 84 },
    { label: 'Maintainability', value: Math.min(96, 78 + avgWasteSaved + avgCostSaved) },
  ];
}

export function createPrReview() {
  const diffs = getAllInteractionDiffs();
  const totalSavedRenders = diffs.reduce((sum, diff) => sum + diff.savedRenders, 0);
  const totalSavedWaste = diffs.reduce((sum, diff) => sum + diff.savedWaste, 0);
  const totalSavedCost = diffs.reduce((sum, diff) => Number((sum + diff.savedCost).toFixed(1)), 0);
  const savedSlots = loadWhatIfSlots();

  return `## React Architecture Review

### Summary

This change improves render boundaries and reduces unnecessary UI updates.

### Evidence

- Render reduction across scenarios: ${totalSavedRenders}
- Wasted renders removed: ${totalSavedWaste}
- Simulated render cost saved: ${totalSavedCost}ms
- Saved What If scenarios: ${savedSlots.length}

### Blocking Issues

- Verify state is not owned by broad page shells unless multiple sections truly coordinate it.
- Verify context values are split by update frequency.

### Non-blocking Suggestions

- Keep feature-owned hooks inside feature folders.
- Stabilize props before relying on React.memo.
- Add focused tests for extracted hooks and reducers.

### Suggested Follow-up

Run Project Analyzer, Folder Compare, and Replay Debugger before merging high-impact dashboard changes.
`;
}

export function getSavedScenarioSummary() {
  const slots = loadWhatIfSlots();
  if (!slots.length) {
    return {
      slots,
      best: null,
      averageScore: 0,
    };
  }
  const best = [...slots].sort((a, b) => b.result.score - a.result.score)[0];
  const averageScore = Math.round(slots.reduce((sum, slot) => sum + slot.result.score, 0) / slots.length);
  return {
    slots,
    best,
    averageScore,
  };
}
