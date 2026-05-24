import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../ui/utils.js';

export function DiffMetricRow({ label, bad, good, suffix = '', inverse = false }) {
  const improved = inverse ? good > bad : good < bad;

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-rose-200">
        {bad}
        {suffix}
      </span>
      <span className={cn('inline-flex items-center gap-1 justify-self-end rounded-md px-2 py-1 font-mono text-xs', improved ? 'bg-success/[0.12] text-emerald-200' : 'bg-warning/[0.12] text-amber-200')}>
        {improved && inverse ? <ArrowUpRight className="h-3.5 w-3.5" /> : improved ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
        {good}
        {suffix}
      </span>
    </div>
  );
}
