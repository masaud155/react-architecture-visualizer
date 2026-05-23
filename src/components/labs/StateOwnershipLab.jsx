import { useMemo, useState } from 'react';
import { Card, CardTitle } from '../ui/Card.jsx';
import { MetricCard } from '../ui/MetricCard.jsx';
import { SegmentedControl } from '../ui/Tabs.jsx';
import { CodeBlock } from '../ui/CodeBlock.jsx';
import { TakeawayCard } from '../ui/TakeawayCard.jsx';
import { codeSamples } from '../../data/codeSamples.js';

const options = {
  App: { impact: 14, wasted: 9, score: 28, note: 'Every major screen can be invalidated by search state.' },
  Dashboard: { impact: 10, wasted: 6, score: 42, note: 'The page is smaller than App, but unrelated dashboard zones still render.' },
  SearchSection: { impact: 3, wasted: 0, score: 88, note: 'The update stays inside the search interaction zone.' },
  SearchBar: { impact: 2, wasted: 0, score: 82, note: 'Good for input text, but shared search results may need a parent section.' },
};

export function StateOwnershipLab() {
  const [owner, setOwner] = useState('Dashboard');
  const current = useMemo(() => options[owner], [owner]);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <Card>
        <CardTitle>State Ownership Lab</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">Move the same search state through the tree and watch the render blast radius change.</p>
        <div className="mt-5">
          <SegmentedControl options={Object.keys(options)} value={owner} onChange={setOwner} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <MetricCard label="Render impact" value={current.impact} detail="Components touched" />
          <MetricCard label="Wasted renders" value={current.wasted} detail="Unrelated updates" tone={current.wasted ? 'danger' : 'success'} />
          <MetricCard label="Locality score" value={current.score} detail="Out of 100" tone={current.score > 70 ? 'success' : 'warning'} />
        </div>
        <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-5">
          <p className="text-sm leading-6 text-slate-200">{current.note}</p>
        </div>
      </Card>
      <div className="space-y-4">
        <CodeBlock label="Bad JSX" code={codeSamples.ownership.bad} />
        <CodeBlock label="Good JSX" code={codeSamples.ownership.good} />
        <TakeawayCard>{codeSamples.ownership.takeaway}</TakeawayCard>
      </div>
    </div>
  );
}
