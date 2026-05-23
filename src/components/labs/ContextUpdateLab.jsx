import { Card, CardTitle } from '../ui/Card.jsx';
import { CodeBlock } from '../ui/CodeBlock.jsx';
import { MetricCard } from '../ui/MetricCard.jsx';
import { TakeawayCard } from '../ui/TakeawayCard.jsx';
import { codeSamples } from '../../data/codeSamples.js';
import { useSimulatorStore } from '../../store/simulatorStore.js';

export function ContextUpdateLab() {
  const architectureMode = useSimulatorStore((state) => state.architectureMode);
  const broad = architectureMode === 'bad';

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <Card>
        <CardTitle>Context Update Lab</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">{broad ? 'One AppContext contains user, theme, filters, modal state, permissions, and notifications.' : 'Context is split by responsibility and update frequency.'}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <MetricCard label="Theme toggle renders" value={broad ? 11 : 3} tone={broad ? 'danger' : 'success'} />
          <MetricCard label="Context values" value={broad ? 1 : 4} detail={broad ? 'Too broad' : 'Focused'} />
          <MetricCard label="Wasted consumers" value={broad ? 8 : 1} tone={broad ? 'danger' : 'success'} />
        </div>
      </Card>
      <div className="space-y-4">
        <CodeBlock label="Bad JSX" code={codeSamples.context.bad} />
        <CodeBlock label="Good JSX" code={codeSamples.context.good} />
        <TakeawayCard>{codeSamples.context.takeaway}</TakeawayCard>
      </div>
    </div>
  );
}
