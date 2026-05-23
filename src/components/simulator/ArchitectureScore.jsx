import { Badge } from '../ui/Badge.jsx';
import { Card, CardTitle } from '../ui/Card.jsx';
import { getScoreTone } from '../../utils/calculateArchitectureScore.js';
import { useArchitectureScore } from '../../hooks/useArchitectureScore.js';
import { useSimulatorStore } from '../../store/simulatorStore.js';

const labels = {
  stateLocality: 'State locality',
  componentIsolation: 'Component isolation',
  propStability: 'Prop stability',
  renderEfficiency: 'Render efficiency',
  contextUsage: 'Context usage',
  listIsolation: 'List isolation',
  maintainability: 'Maintainability',
  complexity: 'Complexity',
};

export function ArchitectureScore() {
  const { total, scores } = useArchitectureScore();
  const architectureMode = useSimulatorStore((state) => state.architectureMode);
  const tone = getScoreTone(total);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <CardTitle>Architecture Score</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{architectureMode === 'bad' ? 'Problems are intentionally visible.' : 'Render zones are focused and easier to reason about.'}</p>
        </div>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/25">
          <span className="text-lg font-semibold tabular-nums text-slate-100">{total}</span>
          <span className="absolute bottom-2 text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="mt-4">
        <Badge tone={tone}>{architectureMode === 'bad' ? 'needs work' : 'healthy'}</Badge>
      </div>
      <div className="mt-5 space-y-3">
        {Object.entries(scores).map(([key, value]) => (
          <div key={key}>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>{labels[key]}</span>
              <span>{value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-300" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
