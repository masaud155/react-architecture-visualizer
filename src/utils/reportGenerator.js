import { interactionOptions } from '../data/scenarios.js';
import { getAllInteractionDiffs } from './renderMetrics.js';

export function createArchitectureReport() {
  const diffs = getAllInteractionDiffs();
  const totals = diffs.reduce(
    (acc, diff) => ({
      savedRenders: acc.savedRenders + diff.savedRenders,
      savedWaste: acc.savedWaste + diff.savedWaste,
      savedCost: Number((acc.savedCost + diff.savedCost).toFixed(1)),
    }),
    { savedRenders: 0, savedWaste: 0, savedCost: 0 },
  );

  const rows = diffs
    .map((diff) => {
      const label = interactionOptions.find((item) => item.id === diff.bad.interactionId)?.label ?? diff.bad.interactionId;
      return `| ${label} | ${diff.bad.rendered} -> ${diff.good.rendered} | ${diff.bad.wasted} -> ${diff.good.wasted} | ${diff.bad.totalCost}ms -> ${diff.good.totalCost}ms |`;
    })
    .join('\n');

  return `# React RenderFlow Architecture Report

## Summary

- Total render reduction: ${totals.savedRenders}
- Total wasted render reduction: ${totals.savedWaste}
- Simulated render cost saved: ${totals.savedCost}ms
- Score lift: ${diffs[0].scoreLift} points

## Interaction Comparison

| Interaction | Renders | Wasted renders | Simulated cost |
| --- | ---: | ---: | ---: |
${rows}

## Recommendation

Move state to the smallest responsible component, split broad context values by update frequency, isolate list rows, and stabilize props before reaching for memoization.
`;
}
