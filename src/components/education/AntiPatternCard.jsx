import { CodeBlock } from '../ui/CodeBlock.jsx';

export function AntiPatternCard({ pattern }) {
  return (
    <article className="panel flex h-full flex-col p-5">
      <h3 className="text-base font-semibold">{pattern.title}</h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Problem</dt>
          <dd className="mt-1 text-slate-200">{pattern.problem}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Why it hurts</dt>
          <dd className="mt-1 text-slate-300">{pattern.hurts}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Better pattern</dt>
          <dd className="mt-1 text-slate-300">{pattern.better}</dd>
        </div>
      </dl>
      <div className="mt-5">
        <CodeBlock label="Good JSX" code={pattern.code} />
      </div>
    </article>
  );
}
