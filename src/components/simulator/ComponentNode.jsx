import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/Badge.jsx';
import { cn } from '../ui/utils.js';

export const ComponentNode = memo(function ComponentNode({ data }) {
  const status = data.renderStatus ?? 'idle';

  return (
    <motion.div
      animate={{ scale: status === 'idle' ? 1 : [1, 1.05, 1] }}
      transition={{ duration: 0.45 }}
      className={cn(
        'hairline min-w-48 rounded-lg border bg-slate-950/[0.9] p-3 shadow-panel backdrop-blur',
        status === 'necessary' && 'border-success/60 shadow-glow',
        status === 'wasted' && 'border-danger/70 shadow-danger',
        status === 'idle' && 'border-white/[0.12]',
      )}
    >
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-2 !border-slate-950 !bg-primary" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{data.type}</p>
          <h3 className="mt-1 text-sm font-semibold text-foreground">{data.name}</h3>
        </div>
        <Badge tone={status === 'wasted' ? 'danger' : status === 'necessary' ? 'success' : 'muted'}>{data.renderCount}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {data.ownsState ? <Badge tone="primary">state</Badge> : null}
        {data.receivesProps ? <Badge tone="accent">props</Badge> : null}
        {data.memoized ? <Badge tone="success">memo</Badge> : null}
        {data.warning ? <Badge tone="danger">warning</Badge> : null}
      </div>
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-2 !border-slate-950 !bg-primary" />
    </motion.div>
  );
});
