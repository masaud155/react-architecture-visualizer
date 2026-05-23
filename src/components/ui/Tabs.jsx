import { cn } from './utils.js';

export function SegmentedControl({ options, value, onChange, className }) {
  return (
    <div className={cn('inline-flex rounded-lg border border-white/10 bg-black/20 p-1', className)}>
      {options.map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition',
            value === option ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-white/[0.08] hover:text-foreground',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
