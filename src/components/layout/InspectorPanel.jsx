import { Badge } from '../ui/Badge.jsx';
import { Card, CardTitle } from '../ui/Card.jsx';
import { useSimulatorStore } from '../../store/simulatorStore.js';

function getModeText(developerMode, node, reason) {
  if (!reason) return 'Trigger an interaction to populate render diagnostics for this component.';
  if (developerMode === 'Beginner') {
    return reason.necessary
      ? `${node.name} updated because it needed the latest ${reason.prop}.`
      : `${node.name} updated even though this interaction did not need it.`;
  }
  if (developerMode === 'Senior Engineer') {
    return reason.necessary
      ? `${node.name} sits inside the intended update boundary for ${reason.state}. This is a reasonable render path.`
      : `${node.name} is coupled to ${reason.state}. The issue is boundary design more than a missing memo call.`;
  }
  return reason.necessary
    ? `${node.name} re-rendered because ${reason.state} changed.`
    : `${node.name} re-rendered because its parent or shared dependency changed, but it did not need ${reason.prop}.`;
}

export function InspectorPanel() {
  const nodes = useSimulatorStore((state) => state.nodes);
  const selectedNodeId = useSimulatorStore((state) => state.selectedNodeId);
  const developerMode = useSimulatorStore((state) => state.developerMode);
  const node = nodes.find((item) => item.id === selectedNodeId) ?? nodes[0];
  const reason = node?.lastReason;

  if (!node) return null;

  return (
    <Card className="h-full">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <CardTitle>Why Did This Render?</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{node.name}</p>
        </div>
        <Badge tone={node.renderStatus === 'wasted' ? 'danger' : node.renderStatus === 'necessary' ? 'success' : 'muted'}>
          {node.renderStatus ?? 'idle'}
        </Badge>
      </div>

      <div className="space-y-3 text-sm">
        <p className="rounded-lg border border-white/10 bg-black/[0.22] p-4 leading-6 text-slate-200">{getModeText(developerMode, node, reason)}</p>
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/[0.045] p-3">
            <dt className="text-xs text-muted-foreground">Render count</dt>
            <dd className="mt-1 text-lg font-semibold">{node.renderCount}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.045] p-3">
            <dt className="text-xs text-muted-foreground">State owner</dt>
            <dd className="mt-1 text-lg font-semibold">{node.ownsState ? 'Yes' : 'No'}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.045] p-3">
            <dt className="text-xs text-muted-foreground">Memoized</dt>
            <dd className="mt-1 text-lg font-semibold">{node.memoized ? 'Yes' : 'No'}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.045] p-3">
            <dt className="text-xs text-muted-foreground">Parent caused</dt>
            <dd className="mt-1 text-lg font-semibold">{reason?.parentCaused ? 'Yes' : 'No'}</dd>
          </div>
        </dl>
        {node.warning ? (
          <div className="rounded-lg border border-danger/25 bg-danger/10 p-3 text-rose-100">
            <p className="text-xs uppercase tracking-[0.16em] text-rose-200/80">Warning</p>
            <p className="mt-1">{node.warning}</p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
