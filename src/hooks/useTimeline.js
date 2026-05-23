import { useSimulatorStore } from '../store/simulatorStore.js';

export function useTimeline() {
  return useSimulatorStore((state) => state.timeline);
}
