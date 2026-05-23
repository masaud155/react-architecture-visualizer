import { ArchitectureScore } from '../components/simulator/ArchitectureScore.jsx';
import { InteractionControls } from '../components/simulator/InteractionControls.jsx';
import { RenderFlowCanvas } from '../components/simulator/RenderFlowCanvas.jsx';
import { RenderHeatmap } from '../components/simulator/RenderHeatmap.jsx';
import { InspectorPanel } from '../components/layout/InspectorPanel.jsx';
import { TimelinePanel } from '../components/layout/TimelinePanel.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { useSimulatorStore } from '../store/simulatorStore.js';

export function RenderFlowSimulator() {
  const explanation = useSimulatorStore((state) => state.explanation);
  const architectureMode = useSimulatorStore((state) => state.architectureMode);

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="RenderFlow Simulator"
        title="Inspect render cascades as architecture changes"
        description={explanation}
      >
        <InteractionControls />
      </PageHeader>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-4">
          <div className="panel overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.035] p-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-100">Component Graph</h2>
                  <Badge tone={architectureMode === 'bad' ? 'danger' : 'success'}>
                    {architectureMode === 'bad' ? 'Bad architecture' : 'Good architecture'}
                  </Badge>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Nodes represent component boundaries. Edges separate hierarchy, props, state updates, and context dependencies.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span className="rounded-md border border-success/30 bg-success/[0.1] px-2 py-1 text-emerald-200">green: necessary</span>
                <span className="rounded-md border border-danger/30 bg-danger/[0.1] px-2 py-1 text-rose-200">red: wasted</span>
                <span className="rounded-md border border-white/10 bg-white/[0.045] px-2 py-1">dim: stable</span>
              </div>
            </div>
            <RenderFlowCanvas />
          </div>
          <RenderHeatmap />
        </section>
        <aside className="space-y-4">
          <InspectorPanel />
          <ArchitectureScore />
        </aside>
      </div>
      <TimelinePanel />
    </div>
  );
}
