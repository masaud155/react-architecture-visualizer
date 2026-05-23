import { AlertTriangle } from 'lucide-react';

export function WarningCard({ title, children }) {
  return (
    <div className="rounded-lg border border-warning/25 bg-warning/10 p-4 text-sm text-amber-100">
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-4 w-4" />
        {title}
      </div>
      <p className="text-amber-100/80">{children}</p>
    </div>
  );
}
