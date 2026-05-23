import { Card, CardTitle } from '../ui/Card.jsx';
import { CodeBlock } from '../ui/CodeBlock.jsx';
import { MetricCard } from '../ui/MetricCard.jsx';
import { TakeawayCard } from '../ui/TakeawayCard.jsx';
import { codeSamples } from '../../data/codeSamples.js';

export function MemoizationLab() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <Card>
        <CardTitle>Memoization Lab</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">Memoization is a performance tool, not an architecture strategy. Use it after ownership and boundaries are clear.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <MetricCard label="React.memo" value="Boundary" detail="Skips stable children" />
          <MetricCard label="useMemo" value="Value" detail="Caches expensive derived data" />
          <MetricCard label="useCallback" value="Function" detail="Stabilizes handler identity" />
        </div>
      </Card>
      <div className="space-y-4">
        <CodeBlock label="Bad JSX" code={codeSamples.memo.bad} />
        <CodeBlock label="Good JSX" code={codeSamples.memo.good} />
        <TakeawayCard>{codeSamples.memo.takeaway}</TakeawayCard>
      </div>
    </div>
  );
}
