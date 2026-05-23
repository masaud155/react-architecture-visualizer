import { motion } from 'framer-motion';
import { Card, CardTitle } from '../ui/Card.jsx';
import { useTimeline } from '../../hooks/useTimeline.js';

export function RenderTimeline() {
  const timeline = useTimeline();

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <CardTitle>Render Timeline</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Event sequence from interaction to render impact.</p>
        </div>
        <span className="rounded-md border border-white/10 bg-white/[0.045] px-2 py-1 font-mono text-[11px] text-muted-foreground">
          {timeline.length} events
        </span>
      </div>
      <ol className="mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {timeline.map((item, index) => (
          <motion.li
            key={`${item}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="hairline flex gap-3 rounded-lg border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.025] p-3 text-sm text-slate-200"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/15 text-xs font-semibold text-primary">
              {index + 1}
            </span>
            {item}
          </motion.li>
        ))}
      </ol>
    </Card>
  );
}
