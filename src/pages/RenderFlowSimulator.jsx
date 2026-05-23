import { ArchitectureScore } from '../components/simulator/ArchitectureScore.jsx';
import { InteractionControls } from '../components/simulator/InteractionControls.jsx';
import { RenderFlowCanvas } from '../components/simulator/RenderFlowCanvas.jsx';
import { RenderHeatmap } from '../components/simulator/RenderHeatmap.jsx';
import { InspectorPanel } from '../components/layout/InspectorPanel.jsx';
import { TimelinePanel } from '../components/layout/TimelinePanel.jsx';
import { useSimulatorStore } from '../store/simulatorStore.js';

export function RenderFlowSimulator() {
  const explanation = useSimulatorStore((state) => state.explanation);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          <div className="panel p-4">
            <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Interactive Component Tree Graph</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{explanation}</p>
              </div>
              <InteractionControls />
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
