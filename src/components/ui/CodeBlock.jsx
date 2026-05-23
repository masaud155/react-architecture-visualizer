import { Badge } from './Badge.jsx';

export function CodeBlock({ label, code }) {
  return (
    <div className="hairline overflow-hidden rounded-lg border border-white/10 bg-[#070b16] shadow-[0_18px_42px_rgb(0_0_0/.22)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-2.5">
        <Badge tone={label === 'Good JSX' ? 'success' : 'danger'}>{label}</Badge>
        <span className="font-mono text-[11px] text-muted-foreground">jsx</span>
      </div>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[12px] leading-6 text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}
