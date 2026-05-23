import { motion } from 'framer-motion';
import { Card, CardTitle } from '../ui/Card.jsx';
import { useTimeline } from '../../hooks/useTimeline.js';

export function RenderTimeline() {
  const timeline = useTimeline();

  return (
    <Card>
      <CardTitle>Render Timeline</CardTitle>
      <ol className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {timeline.map((item, index) => (
          <motion.li
            key={`${item}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3 text-sm text-slate-200"
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
