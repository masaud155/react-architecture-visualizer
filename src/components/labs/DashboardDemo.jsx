import { Card, CardTitle } from '../ui/Card.jsx';
import { MetricCard } from '../ui/MetricCard.jsx';
import { InteractionControls } from '../simulator/InteractionControls.jsx';
import { RenderFlowCanvas } from '../simulator/RenderFlowCanvas.jsx';
import { useSimulatorStore } from '../../store/simulatorStore.js';

export function DashboardDemo() {
  const mode = useSimulatorStore((state) => state.architectureMode);

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
          <div>
            <CardTitle>Real-World Dashboard Demo</CardTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              A SaaS dashboard with sidebar, header, search, filters, user table, analytics, chart, notifications, and settings modal.
              {mode === 'bad' ? ' Dashboard owns everything, so small interactions ripple widely.' : ' Each area owns local state and exposes focused boundaries.'}
            </p>
          </div>
          <InteractionControls />
        </div>
      </Card>
      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Owners" value={mode === 'bad' ? '1' : '5'} detail={mode === 'bad' ? 'Dashboard' : 'Focused zones'} tone={mode === 'bad' ? 'danger' : 'success'} />
        <MetricCard label="Prop chains" value={mode === 'bad' ? 'Deep' : 'Short'} />
        <MetricCard label="Context scope" value={mode === 'bad' ? 'Global' : 'Narrow'} />
        <MetricCard label="Maintainability" value={mode === 'bad' ? 'Low' : 'High'} tone={mode === 'bad' ? 'warning' : 'success'} />
      </div>
      <RenderFlowCanvas />
    </div>
  );
}
