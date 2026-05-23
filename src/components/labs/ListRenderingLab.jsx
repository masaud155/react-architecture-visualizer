import { Card, CardTitle } from '../ui/Card.jsx';
import { CodeBlock } from '../ui/CodeBlock.jsx';
import { MetricCard } from '../ui/MetricCard.jsx';
import { Button } from '../ui/Button.jsx';
import { codeSamples } from '../../data/codeSamples.js';
import { useSimulatorStore } from '../../store/simulatorStore.js';
import { cn } from '../ui/utils.js';

const rows = ['Ada Lovelace', 'Grace Hopper', 'Katherine Johnson', 'Margaret Hamilton', 'Radia Perlman', 'Barbara Liskov'];

export function ListRenderingLab() {
  const architectureMode = useSimulatorStore((state) => state.architectureMode);
  const selected = useSimulatorStore((state) => state.listSelectedIndex);
  const setSelected = useSimulatorStore((state) => state.setListSelectedIndex);
  const bad = architectureMode === 'bad';
  const renderedRows = bad ? rows.length : 2;

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>List Rendering Lab</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">Selecting one row should not force every row to render.</p>
          </div>
          <Button variant="secondary" onClick={() => setSelected((selected + 1) % rows.length)}>Select next row</Button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <MetricCard label="Rows rendered" value={renderedRows} tone={bad ? 'danger' : 'success'} />
          <MetricCard label="Wasted rows" value={bad ? rows.length - 1 : 0} tone={bad ? 'danger' : 'success'} />
          <MetricCard label="Total rows" value={rows.length} />
        </div>
        <div className="mt-6 divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10">
          {rows.map((row, index) => {
            const active = index === selected;
            const updated = bad || active || index === Math.max(0, selected - 1);
            return (
              <div key={row} className={cn('flex items-center justify-between px-4 py-3 text-sm', updated ? 'bg-primary/10' : 'bg-white/[0.03]', active && 'text-primary')}>
                <span>{row}</span>
                <span className="font-mono text-xs text-muted-foreground">{updated ? 'rendered' : 'stable'}</span>
              </div>
            );
          })}
        </div>
      </Card>
      <div className="space-y-4">
        <CodeBlock label="Bad JSX" code={codeSamples.list.bad} />
        <CodeBlock label="Good JSX" code={codeSamples.list.good} />
      </div>
    </div>
  );
}
