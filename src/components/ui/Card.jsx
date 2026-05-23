import { cn } from './utils.js';

export function Card({ className, ...props }) {
  return <section className={cn('panel p-5', className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('mb-4 flex items-start justify-between gap-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h2 className={cn('text-base font-semibold tracking-normal text-foreground', className)} {...props} />;
}
