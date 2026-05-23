import { calculateArchitectureScore } from '../utils/calculateArchitectureScore.js';
import { useSimulatorStore } from '../store/simulatorStore.js';

export function useArchitectureScore() {
  const scores = useSimulatorStore((state) => state.score);
  return {
    total: calculateArchitectureScore(scores),
    scores,
  };
}
