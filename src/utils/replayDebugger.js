import { scenarios } from '../data/scenarios.js';
import { getNodeCost } from './renderMetrics.js';
import { getPresetNodes } from '../data/graphPresets.js';

function makeSteps(mode, interactionId) {
  const interaction = scenarios.dashboard[mode].interactions[interactionId];
  const nodes = getPresetNodes('dashboard', mode);
  const necessary = new Set(interaction.necessary);
  const wasted = new Set(interaction.wasted);
  let accumulatedCost = 0;

  return interaction.timeline.map((label, index) => {
    const rendered = nodes.filter((node) => {
      if (index < 2) return false;
      if (index === 2) return necessary.has(node.id);
      return necessary.has(node.id) || wasted.has(node.id);
    });
    accumulatedCost += rendered.reduce((sum, node) => sum + getNodeCost(node), 0) / Math.max(1, interaction.timeline.length - 2);

    return {
      id: `${mode}-${interactionId}-${index}`,
      index,
      label,
      phase: index === 0 ? 'event' : index === 1 ? 'state' : index < interaction.timeline.length - 1 ? 'render' : 'summary',
      necessary: index >= 2 ? interaction.necessary : [],
      wasted: index >= 3 ? interaction.wasted : [],
      cost: Number(accumulatedCost.toFixed(1)),
      explanation: getStepExplanation(mode, interaction, index),
    };
  });
}

function getStepExplanation(mode, interaction, index) {
  if (index === 0) return `The interaction starts: ${interaction.event}.`;
  if (index === 1) return `React schedules an update for ${interaction.state}.`;
  if (mode === 'bad' && index >= 3) return 'Because ownership or dependencies are broad, unrelated components join the render cascade.';
  if (mode === 'good' && index >= 3) return 'The update stays inside a focused boundary, so unrelated UI remains stable.';
  return `React evaluates the components that depend on ${interaction.changedProp}.`;
}

export function getReplayComparison(interactionId) {
  return {
    bad: makeSteps('bad', interactionId),
    good: makeSteps('good', interactionId),
  };
}

export function createReplayReport(interactionLabel, badStep, goodStep) {
  return `# Render Replay Report

Interaction: ${interactionLabel}

## Current Step

- Bad architecture phase: ${badStep.phase}
- Bad architecture cost: ${badStep.cost}ms
- Good architecture phase: ${goodStep.phase}
- Good architecture cost: ${goodStep.cost}ms

## What changed

Bad: ${badStep.explanation}

Good: ${goodStep.explanation}

## Learning takeaway

Focused state ownership and narrower dependency paths reduce the number of components that participate in a render cascade.
`;
}
