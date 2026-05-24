import { useMemo, useState } from 'react';
import { ArrowRight, GitCompare, TimerReset } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { DiffMetricRow } from '../components/simulator/DiffMetricRow.jsx';
import { interactionOptions } from '../data/scenarios.js';
import { getDiffMetrics } from '../utils/renderMetrics.js';

export function BeforeAfterDiff() {
  const [interactionId, setInteractionId] = useState('search');
  const diff = useMemo(() => getDiffMetrics(interactionId), [interactionId]);
  const activeLabel = interactionOptions.find((item) => item.id === interactionId)?.label;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Before vs After"
        title="Compare architecture impact side by side"
        description="Measure how focused ownership changes render count, wasted work, simulated render cost, and maintainability score for the same user interaction."
      >
        <select
          value={interactionId}
          onChange={(event) => setInteractionId(event.target.value)}
          className="h-10 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary sm:w-72"
        >
          {interactionOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </PageHeader>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Saved renders" value={diff.savedRenders} detail={activeLabel} tone="success" />
        <MetricCard label="Wasted renders removed" value={diff.savedWaste} detail="Unrelated updates avoided" tone="success" />
        <MetricCard label="Render cost saved" value={`${diff.savedCost}ms`} detail="Simulated per interaction" tone="success" />
        <MetricCard label="Score lift" value={`+${diff.scoreLift}`} detail="Architecture score" tone="primary" />
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        {[
          { title: 'Bad Architecture', tone: 'danger', data: diff.bad },
          { title: 'Good Architecture', tone: 'success', data: diff.good },
        ].map((column) => (
          <Card key={column.title}>
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <Badge tone={column.tone}>{column.title}</Badge>
                <CardTitle className="mt-3">{column.data.label}</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{column.data.summary}</p>
              </div>
              <GitCompare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Rendered" value={column.data.rendered} detail="Components touched" tone={column.tone === 'danger' ? 'danger' : 'success'} />
              <MetricCard label="Wasted" value={column.data.wasted} detail="Unnecessary renders" tone={column.data.wasted ? 'danger' : 'success'} />
              <MetricCard label="Cost" value={`${column.data.totalCost}ms`} detail="Simulated work" tone={column.tone === 'danger' ? 'warning' : 'success'} />
              <MetricCard label="Efficiency" value={`${column.data.efficiency}%`} detail="Useful render ratio" tone={column.data.efficiency > 75 ? 'success' : 'warning'} />
            </div>
          </Card>
        ))}
      </section>

      <Card>
        <CardTitle>Impact Delta</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">The right value shows the optimized architecture for the same interaction.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <DiffMetricRow label="Rendered components" bad={diff.bad.rendered} good={diff.good.rendered} />
          <DiffMetricRow label="Wasted renders" bad={diff.bad.wasted} good={diff.good.wasted} />
          <DiffMetricRow label="Simulated cost" bad={diff.bad.totalCost} good={diff.good.totalCost} suffix="ms" />
          <DiffMetricRow label="Efficiency" bad={diff.bad.efficiency} good={diff.good.efficiency} suffix="%" inverse />
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <TimerReset className="h-5 w-5 text-primary" />
          <CardTitle>What Changed?</CardTitle>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-lg border border-danger/20 bg-danger/[0.08] p-4">
            <p className="text-sm font-medium text-rose-100">Before</p>
            <p className="mt-2 text-sm leading-6 text-rose-100/75">{diff.bad.timeline.join(' ')}</p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="rounded-lg border border-success/20 bg-success/[0.08] p-4">
            <p className="text-sm font-medium text-emerald-100">After</p>
            <p className="mt-2 text-sm leading-6 text-emerald-100/75">{diff.good.timeline.join(' ')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
