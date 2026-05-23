import { MetricCard } from '../ui/MetricCard.jsx';
import { useSimulatorStore } from '../../store/simulatorStore.js';

export function RenderHeatmap() {
  const nodes = useSimulatorStore((state) => state.nodes);
  const necessary = nodes.filter((node) => node.renderStatus === 'necessary').length;
  const wasted = nodes.filter((node) => node.renderStatus === 'wasted').length;
  const total = nodes.reduce((sum, node) => sum + node.renderCount, 0);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <MetricCard label="Total renders" value={total} detail="Across current session" />
      <MetricCard label="Correct renders" value={necessary} detail="Needed by interaction" tone="success" />
      <MetricCard label="Wasted renders" value={wasted} detail="Unnecessary UI updates" tone={wasted > 0 ? 'danger' : 'success'} />
    </div>
  );
}
