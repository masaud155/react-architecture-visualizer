import { cn } from './utils.js';

export function MetricCard({ label, value, detail, tone = 'primary' }) {
  const tones = {
    primary: 'from-primary/[0.18] to-transparent text-primary',
    success: 'from-success/[0.18] to-transparent text-emerald-300',
    warning: 'from-warning/[0.18] to-transparent text-amber-300',
    danger: 'from-danger/[0.18] to-transparent text-rose-300',
  };

  return (
    <div className="hairline rounded-lg border border-white/10 bg-white/[0.035] p-4 transition hover:border-white/15">
      <div className={cn('mb-4 h-1 rounded-full bg-gradient-to-r', tones[tone])} />
      <p className="text-[11px] font-medium uppercase tracking-[0.13em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}
