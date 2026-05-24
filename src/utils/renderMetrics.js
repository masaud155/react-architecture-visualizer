import { scenarios } from '../data/scenarios.js';
import { getPresetNodes } from '../data/graphPresets.js';
import { calculateArchitectureScore } from './calculateArchitectureScore.js';

const typeCost = {
  App: 1.5,
  Layout: 1.2,
  Page: 2.4,
  SearchBar: 0.8,
  FilterPanel: 1.4,
  UserTable: 4.8,
  UserRow: 1.1,
  ChartPanel: 7.5,
  Modal: 2.2,
  Sidebar: 1.7,
  ContextProvider: 1.3,
  StateOwner: 1.2,
};

export function getNodeCost(node) {
  return typeCost[node.type] ?? 1;
}

export function getInteractionMetrics(mode, interactionId, scenarioId = 'dashboard') {
  const interaction = scenarios[scenarioId][mode].interactions[interactionId];
  const nodes = getPresetNodes(scenarioId, mode);
  const renderedIds = new Set([...interaction.necessary, ...interaction.wasted]);
  const wastedIds = new Set(interaction.wasted);

  const renderedNodes = nodes.filter((node) => renderedIds.has(node.id));
  const wastedNodes = nodes.filter((node) => wastedIds.has(node.id));
  const totalCost = renderedNodes.reduce((sum, node) => sum + getNodeCost(node), 0);
  const wastedCost = wastedNodes.reduce((sum, node) => sum + getNodeCost(node), 0);

  return {
    mode,
    interactionId,
    label: scenarios[scenarioId][mode].label,
    summary: scenarios[scenarioId][mode].summary,
    score: calculateArchitectureScore(scenarios[scenarioId][mode].score),
    rendered: renderedNodes.length,
    necessary: interaction.necessary.length,
    wasted: interaction.wasted.length,
    totalCost: Number(totalCost.toFixed(1)),
    wastedCost: Number(wastedCost.toFixed(1)),
    efficiency: renderedNodes.length ? Math.round((interaction.necessary.length / renderedNodes.length) * 100) : 100,
    timeline: interaction.timeline,
  };
}

export function getDiffMetrics(interactionId, scenarioId = 'dashboard') {
  const bad = getInteractionMetrics('bad', interactionId, scenarioId);
  const good = getInteractionMetrics('good', interactionId, scenarioId);

  return {
    bad,
    good,
    savedRenders: Math.max(0, bad.rendered - good.rendered),
    savedWaste: Math.max(0, bad.wasted - good.wasted),
    savedCost: Number(Math.max(0, bad.totalCost - good.totalCost).toFixed(1)),
    scoreLift: good.score - bad.score,
  };
}

export function getAllInteractionDiffs(scenarioId = 'dashboard') {
  return Object.keys(scenarios[scenarioId].bad.interactions).map((interactionId) => getDiffMetrics(interactionId, scenarioId));
}
