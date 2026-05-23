import { SegmentedControl } from '../ui/Tabs.jsx';
import { useSimulatorStore } from '../../store/simulatorStore.js';

export function ModeToggle() {
  const architectureMode = useSimulatorStore((state) => state.architectureMode);
  const setArchitectureMode = useSimulatorStore((state) => state.setArchitectureMode);

  return (
    <SegmentedControl
      options={['Bad Architecture', 'Good Architecture']}
      value={architectureMode === 'bad' ? 'Bad Architecture' : 'Good Architecture'}
      onChange={(value) => setArchitectureMode(value === 'Bad Architecture' ? 'bad' : 'good')}
    />
  );
}
