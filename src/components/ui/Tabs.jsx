import { cn } from './utils.js';

export function SegmentedControl({ options, value, onChange, className }) {
  return (
    <div className={cn('inline-flex rounded-lg border border-white/10 bg-black/25 p-1 shadow-[inset_0_1px_0_rgb(255_255_255/.05)]', className)}>
      {options.map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition duration-200',
            value === option
              ? 'bg-primary text-primary-foreground shadow-[0_8px_24px_rgb(20_184_166/.22)]'
              : 'text-muted-foreground hover:bg-white/[0.08] hover:text-foreground',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
