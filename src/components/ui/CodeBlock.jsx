import { Badge } from './Badge.jsx';

export function CodeBlock({ label, code }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/80">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <Badge tone={label === 'Good JSX' ? 'success' : 'danger'}>{label}</Badge>
        <span className="font-mono text-[11px] text-muted-foreground">jsx</span>
      </div>
      <pre className="max-h-72 overflow-auto p-4 text-xs leading-6 text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}
