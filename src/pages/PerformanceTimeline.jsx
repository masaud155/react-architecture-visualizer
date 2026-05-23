import { InteractionControls } from '../components/simulator/InteractionControls.jsx';
import { RenderTimeline } from '../components/simulator/RenderTimeline.jsx';
import { RenderHeatmap } from '../components/simulator/RenderHeatmap.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';

export function PerformanceTimeline() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 xl:grid-cols-[1fr_440px]">
          <div>
            <CardTitle>Performance Timeline</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Trigger interactions to inspect the exact event sequence from user action to component render impact.</p>
          </div>
          <InteractionControls />
        </div>
      </Card>
      <RenderHeatmap />
      <RenderTimeline />
    </div>
  );
}
