import { cn } from './utils.js';

export function MetricCard({ label, value, detail, tone = 'primary' }) {
  const tones = {
    primary: 'from-primary/[0.18] to-transparent text-primary',
    success: 'from-success/[0.18] to-transparent text-emerald-300',
    warning: 'from-warning/[0.18] to-transparent text-amber-300',
    danger: 'from-danger/[0.18] to-transparent text-rose-300',
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <div className={cn('mb-3 h-1.5 rounded-full bg-gradient-to-r', tones[tone])} />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}
