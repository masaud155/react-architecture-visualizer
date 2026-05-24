import { useMemo, useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { interactionOptions } from '../data/scenarios.js';
import { getDiffMetrics } from '../utils/renderMetrics.js';

export function ProfilerFlamegraph() {
  const [interactionId, setInteractionId] = useState('search');
  const diff = useMemo(() => getDiffMetrics(interactionId), [interactionId]);
  const bars = [
    { name: 'Bad total render cost', value: diff.bad.totalCost, color: 'bg-danger' },
    { name: 'Bad wasted cost', value: diff.bad.wastedCost, color: 'bg-warning' },
    { name: 'Good total render cost', value: diff.good.totalCost, color: 'bg-success' },
    { name: 'Good wasted cost', value: diff.good.wastedCost, color: 'bg-primary' },
  ];
  const max = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Profiler" title="Profiler Flamegraph View" description="A lightweight profiler-style view that translates render cascades into simulated milliseconds and wasted work." >
        <select value={interactionId} onChange={(event) => setInteractionId(event.target.value)} className="h-10 rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary">
          {interactionOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      </PageHeader>
      <Card>
        <CardTitle>Render Cost Flamegraph</CardTitle>
        <div className="mt-6 space-y-4">
          {bars.map((bar) => (
            <div key={bar.name}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-200">{bar.name}</span>
                <span className="font-mono text-muted-foreground">{bar.value}ms</span>
              </div>
              <div className="h-9 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
                <div className={`h-full ${bar.color}`} style={{ width: `${Math.max(4, (bar.value / max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
