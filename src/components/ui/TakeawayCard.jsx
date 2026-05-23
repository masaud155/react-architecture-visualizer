import { Lightbulb } from 'lucide-react';

export function TakeawayCard({ children }) {
  return (
    <div className="rounded-lg border border-primary/25 bg-primary/10 p-4 text-sm text-teal-100">
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <Lightbulb className="h-4 w-4" />
        Practical takeaway
      </div>
      <p className="text-teal-100/[0.82]">{children}</p>
    </div>
  );
}
