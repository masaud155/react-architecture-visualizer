import { useSimulatorStore } from '../store/simulatorStore.js';

export function useRenderSimulation() {
  return {
    triggerInteraction: useSimulatorStore((state) => state.triggerInteraction),
    resetSimulation: useSimulatorStore((state) => state.resetSimulation),
    selectedInteraction: useSimulatorStore((state) => state.selectedInteraction),
    setSelectedInteraction: useSimulatorStore((state) => state.setSelectedInteraction),
  };
}
