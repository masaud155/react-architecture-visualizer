import { CheckCircle2 } from 'lucide-react';

export function ChecklistCard({ item, index }) {
  return (
    <label className="panel flex cursor-pointer items-start gap-4 p-4 transition hover:border-primary/35 hover:bg-white/[0.055]">
      <input type="checkbox" className="peer sr-only" />
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-sm text-muted-foreground peer-checked:border-primary/40 peer-checked:bg-primary/15 peer-checked:text-primary">
        <CheckCircle2 className="h-4 w-4" />
      </span>
      <span>
        <span className="text-xs text-muted-foreground">Check {index + 1}</span>
        <span className="block text-sm font-medium text-foreground">{item}</span>
      </span>
    </label>
  );
}
