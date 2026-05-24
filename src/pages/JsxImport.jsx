import { useMemo, useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { analyzeJsxSource } from '../utils/jsxParser.js';

const starter = `<Dashboard>
  <Sidebar user={user} />
  <SearchSection query={query} />
  <UserTable rows={users} selectedId={selectedId} />
  <ChartPanel options={{ dense: true }} />
</Dashboard>`;

export function JsxImport() {
  const [source, setSource] = useState(starter);
  const analysis = useMemo(() => analyzeJsxSource(source), [source]);
  const { components, diagnostics, edges, inlineRiskCount, maxDepth, score } = analysis;

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Pro Import" title="AST-powered JSX analyzer" description="Paste JSX to parse component boundaries with Babel, detect parent-child relationships, inline prop identity risks, and likely render review areas." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>JSX Input</CardTitle>
            <Badge tone="primary">Babel AST</Badge>
          </div>
          <textarea
            value={source}
            onChange={(event) => setSource(event.target.value)}
            className="mt-4 h-[420px] w-full resize-none rounded-lg border border-white/10 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200 outline-none focus:border-primary"
          />
        </Card>
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Components found" value={components.length} />
            <MetricCard label="Import score" value={score} tone={score > 70 ? 'success' : 'warning'} />
            <MetricCard label="Max JSX depth" value={maxDepth} />
            <MetricCard label="Inline risks" value={inlineRiskCount} tone={inlineRiskCount ? 'warning' : 'success'} />
          </div>
          <Card>
            <CardTitle>Extracted Boundaries</CardTitle>
            <div className="mt-4 space-y-2">
              {components.map((component) => (
                <div key={component.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-sm text-slate-100">{component.name}</p>
                    <Badge tone={component.depthLabel === 'leaf' ? 'warning' : 'primary'}>{component.depthLabel}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1">renders: {component.count}</span>
                    <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1">parent: {component.parent ?? 'none'}</span>
                    <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1">props: {component.props.length || 0}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{component.warning}</p>
                </div>
              ))}
              {!components.length ? <p className="rounded-lg border border-danger/20 bg-danger/[0.08] p-3 text-sm text-rose-100">No component boundaries found. Paste JSX with capitalized React component names.</p> : null}
            </div>
          </Card>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardTitle>Prop Identity Diagnostics</CardTitle>
          <div className="mt-4 space-y-2">
            {diagnostics.map((diagnostic, index) => (
              <div key={`${diagnostic.component}-${diagnostic.prop}-${index}`} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={diagnostic.severity === 'danger' ? 'danger' : diagnostic.severity === 'warning' ? 'warning' : 'muted'}>{diagnostic.type}</Badge>
                  {diagnostic.component ? <span className="font-mono text-sm text-slate-200">{diagnostic.component}</span> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{diagnostic.message}</p>
              </div>
            ))}
            {!diagnostics.length ? <p className="rounded-lg border border-success/20 bg-success/[0.08] p-3 text-sm text-emerald-100">No inline identity risks detected in this snippet.</p> : null}
          </div>
        </Card>

        <Card>
          <CardTitle>Detected Component Edges</CardTitle>
          <div className="mt-4 space-y-2">
            {edges.map((edge, index) => (
              <div key={`${edge.source}-${edge.target}-${index}`} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm">
                <span className="font-mono text-slate-200">{edge.source}</span>
                <span className="text-muted-foreground">passes children to</span>
                <span className="font-mono text-primary">{edge.target}</span>
              </div>
            ))}
            {!edges.length ? <p className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-muted-foreground">Edges appear after nested custom components are detected.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
