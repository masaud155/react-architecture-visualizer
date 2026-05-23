import { create } from 'zustand';
import { scenarios } from '../data/scenarios.js';
import { getPresetEdges, getPresetNodes } from '../data/graphPresets.js';
import { calculateRenderImpact } from '../utils/calculateRenderImpact.js';

const scenarioId = 'dashboard';

function createInitialState(architectureMode = 'bad') {
  const scenario = scenarios[scenarioId][architectureMode];

  return {
    scenarioId,
    architectureMode,
    developerMode: 'Intermediate',
    selectedInteraction: 'search',
    selectedNodeId: 'dashboard',
    nodes: getPresetNodes(scenarioId, architectureMode),
    edges: getPresetEdges(scenarioId, architectureMode),
    timeline: ['Select an interaction and trigger the simulator to inspect render flow.'],
    score: scenario.score,
    explanation: scenario.summary,
    lastInteraction: null,
  };
}

export const useSimulatorStore = create((set, get) => ({
  ...createInitialState('bad'),
  setArchitectureMode: (architectureMode) => {
    set(createInitialState(architectureMode));
  },
  setDeveloperMode: (developerMode) => set({ developerMode }),
  setSelectedInteraction: (selectedInteraction) => set({ selectedInteraction }),
  selectNode: (selectedNodeId) => set({ selectedNodeId }),
  triggerInteraction: () => {
    const state = get();
    const interaction = scenarios[state.scenarioId][state.architectureMode].interactions[state.selectedInteraction];

    set({
      nodes: calculateRenderImpact(state.nodes, interaction),
      timeline: interaction.timeline,
      lastInteraction: interaction,
    });
  },
  resetSimulation: () => {
    const { architectureMode } = get();
    set(createInitialState(architectureMode));
  },
}));
