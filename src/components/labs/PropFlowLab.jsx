import { CodeBlock } from '../ui/CodeBlock.jsx';
import { Card, CardTitle } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { TakeawayCard } from '../ui/TakeawayCard.jsx';
import { codeSamples } from '../../data/codeSamples.js';

const chain = ['App', 'Dashboard', 'Layout', 'Sidebar', 'Menu', 'ProfileBadge'];

export function PropFlowLab() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <Card>
        <CardTitle>Prop Flow Visualizer</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">The animated path shows a user prop passing through components that do not use it.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {chain.map((item, index) => (
            <div key={item} className="flex items-center gap-3">
              <div className="rounded-lg border border-white/10 bg-slate-950 px-4 py-3">
                <p className="text-sm font-semibold">{item}</p>
                {index > 0 && index < chain.length - 1 ? <Badge tone="danger" className="mt-2">passes unused prop</Badge> : null}
              </div>
              {index < chain.length - 1 ? <div className="h-px w-10 bg-accent shadow-[0_0_18px_rgb(139_92_246/.7)]" /> : null}
            </div>
          ))}
        </div>
      </Card>
      <div className="space-y-4">
        <CodeBlock label="Bad JSX" code={codeSamples.propFlow.bad} />
        <CodeBlock label="Good JSX" code={codeSamples.propFlow.good} />
        <TakeawayCard>{codeSamples.propFlow.takeaway}</TakeawayCard>
      </div>
    </div>
  );
}
