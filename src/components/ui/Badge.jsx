import { cn } from './utils.js';

export function Badge({ tone = 'muted', className, ...props }) {
  const tones = {
    muted: 'border-white/10 bg-white/[0.07] text-muted-foreground',
    success: 'border-success/30 bg-success/[0.12] text-emerald-200',
    warning: 'border-warning/30 bg-warning/[0.12] text-amber-200',
    danger: 'border-danger/30 bg-danger/[0.12] text-rose-200',
    accent: 'border-accent/30 bg-accent/[0.14] text-violet-100',
    primary: 'border-primary/30 bg-primary/[0.12] text-teal-100',
  };

  return (
    <span
      className={cn('inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium leading-none', tones[tone], className)}
      {...props}
    />
  );
}
