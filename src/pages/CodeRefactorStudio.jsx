import { useMemo, useState } from 'react';
import { Check, Clipboard, Code2, Wand2 } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { analyzeReactCode, generateRefactor, getRefactorImpact, refactorActions, starterRefactorCode } from '../utils/codeRefactorStudio.js';

function toggleValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function CodeRefactorStudio() {
  const [source, setSource] = useState(starterRefactorCode);
  const analysis = useMemo(() => analyzeReactCode(source), [source]);
  const [selectedActions, setSelectedActions] = useState(analysis.actions);
  const [copied, setCopied] = useState(false);
  const improvedCode = useMemo(() => generateRefactor(source, selectedActions), [source, selectedActions]);
  const impact = useMemo(() => getRefactorImpact(selectedActions), [selectedActions]);

  async function copyCode() {
    await navigator.clipboard.writeText(improvedCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Code Refactor Studio"
        title="Analyze React code and preview architecture refactors"
        description="Paste a component, detect render architecture smells, choose refactor actions, and compare the improved code shape side by side."
      >
        <Button onClick={copyCode}>
          {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy improved code'}
        </Button>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Code score" value={analysis.score} tone={analysis.score > 75 ? 'success' : analysis.score > 55 ? 'warning' : 'danger'} />
        <MetricCard label="Detected smells" value={analysis.smells.length} tone={analysis.smells.length ? 'warning' : 'success'} />
        <MetricCard label="Render reduction" value={`${impact.renderReduction}%`} tone="success" />
        <MetricCard label="Wasted reduction" value={`${impact.wastedReduction}%`} tone="success" />
        <MetricCard label="Confidence" value={impact.confidence} tone={impact.confidence === 'High' ? 'success' : 'warning'} />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="grid gap-4 xl:grid-cols-2">
          <Card>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <CardTitle>Current Code</CardTitle>
            </div>
            <textarea
              value={source}
              onChange={(event) => setSource(event.target.value)}
              className="mt-4 h-[640px] w-full resize-none rounded-lg border border-white/10 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200 outline-none focus:border-primary"
            />
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              <CardTitle>Improved Code Preview</CardTitle>
            </div>
            <pre className="mt-4 h-[640px] overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">
              {improvedCode}
            </pre>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardTitle>Detected Smells</CardTitle>
            <div className="mt-4 space-y-2">
              {analysis.smells.map((smell) => (
                <div key={smell.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-100">{smell.title}</p>
                    <Badge tone={smell.severity === 'danger' ? 'danger' : 'warning'}>{smell.severity}</Badge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{smell.detail}</p>
                </div>
              ))}
              {!analysis.smells.length ? <p className="rounded-lg border border-success/20 bg-success/[0.08] p-3 text-sm text-emerald-100">No major smells detected.</p> : null}
            </div>
          </Card>

          <Card>
            <CardTitle>Refactor Actions</CardTitle>
            <div className="mt-4 space-y-2">
              {refactorActions.map((action) => {
                const active = selectedActions.includes(action.id);
                return (
                  <button
                    type="button"
                    key={action.id}
                    onClick={() => setSelectedActions((items) => toggleValue(items, action.id))}
                    className={`w-full rounded-lg border p-3 text-left transition ${active ? 'border-primary/40 bg-primary/[0.1]' : 'border-white/10 bg-white/[0.035] hover:border-white/20'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-100">{action.label}</p>
                      <Badge tone={active ? 'primary' : 'muted'}>{active ? 'enabled' : 'off'}</Badge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{action.impact}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardTitle>Expected Impact</CardTitle>
            <div className="mt-4 space-y-3 text-sm">
              <p className="rounded-lg border border-success/20 bg-success/[0.08] p-3 text-emerald-100">Render reduction: {impact.renderReduction}%</p>
              <p className="rounded-lg border border-primary/20 bg-primary/[0.08] p-3 text-teal-100">Wasted render reduction: {impact.wastedReduction}%</p>
              <p className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-slate-200">Maintainability lift: {impact.maintainabilityLift}%</p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
