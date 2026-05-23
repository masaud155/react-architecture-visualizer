import { Card, CardTitle } from '../ui/Card.jsx';
import { CodeBlock } from '../ui/CodeBlock.jsx';
import { MetricCard } from '../ui/MetricCard.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
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
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_440px]">
      <Card className="min-h-[520px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>List Rendering Lab</CardTitle>
              <Badge tone={bad ? 'danger' : 'success'}>{bad ? 'Bad render zone' : 'Isolated rows'}</Badge>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Selecting one row should update only the affected row boundary, not the entire table.</p>
          </div>
          <Button variant="secondary" onClick={() => setSelected((selected + 1) % rows.length)}>Select next row</Button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <MetricCard label="Rows rendered" value={renderedRows} tone={bad ? 'danger' : 'success'} />
          <MetricCard label="Wasted rows" value={bad ? rows.length - 1 : 0} tone={bad ? 'danger' : 'success'} />
          <MetricCard label="Total rows" value={rows.length} />
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-white/10 bg-slate-950/50">
          <div className="min-w-[520px]">
            <div className="grid grid-cols-[1fr_130px_100px] border-b border-white/10 bg-white/[0.035] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <span>User</span>
              <span>Status</span>
              <span className="text-right">Render</span>
            </div>
            {rows.map((row, index) => {
              const active = index === selected;
              const updated = bad || active || index === Math.max(0, selected - 1);
              return (
                <div
                  key={row}
                  className={cn(
                    'grid grid-cols-[1fr_130px_100px] items-center border-b border-white/[0.08] px-4 py-3 text-sm last:border-b-0',
                    updated ? 'bg-primary/[0.075]' : 'bg-white/[0.02]',
                    active && 'text-primary',
                  )}
                >
                  <span className="font-medium">{row}</span>
                  <span className="text-xs text-muted-foreground">{active ? 'selected' : 'idle'}</span>
                  <span className={cn('justify-self-end rounded-md px-2 py-1 font-mono text-[11px]', updated ? 'bg-primary/15 text-primary' : 'bg-white/[0.055] text-muted-foreground')}>
                    {updated ? 'rendered' : 'stable'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
      <aside className="space-y-4">
        <CodeBlock label="Bad JSX" code={codeSamples.list.bad} />
        <CodeBlock label="Good JSX" code={codeSamples.list.good} />
        <Card>
          <CardTitle>What to notice</CardTitle>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            In bad mode, the selected id is treated like broad table state and every row participates. In good mode, rows receive stable primitive props and only the changed row boundaries render.
          </p>
        </Card>
      </aside>
    </div>
  );
}
