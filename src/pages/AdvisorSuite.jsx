import { useMemo, useState } from 'react';
import { BrainCircuit, CheckCircle2, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { contextFields, memoDecisionQuestions, propStabilityChecks, responsibilities } from '../data/featureData.js';

export function AdvisorSuite() {
  const [answers, setAnswers] = useState({});
  const memoScore = useMemo(
    () => memoDecisionQuestions.reduce((sum, question, index) => sum + (answers[index] === 'yes' ? question.yes : answers[index] === 'no' ? question.no : 0), 50),
    [answers],
  );
  const recommendation = memoScore >= 80 ? 'Memoization is likely useful after props are stable.' : memoScore >= 55 ? 'Fix prop stability first, then benchmark memoization.' : 'This looks like an ownership or boundary problem, not a memo problem.';

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Advisor Suite" title="Architecture advisors and review tools" description="Analyze prop stability, context boundaries, component responsibility, memo decisions, and render budget warnings in one place." />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardTitle>Prop Stability Analyzer</CardTitle>
          <div className="mt-4 space-y-3">
            {propStabilityChecks.map((check) => (
              <div key={check.pattern} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{check.pattern}</p>
                  <Badge tone="warning">unstable risk</Badge>
                </div>
                <code className="mt-3 block rounded-md bg-slate-950 p-3 text-xs text-slate-200">{check.example}</code>
                <p className="mt-3 text-sm text-muted-foreground">{check.issue}. {check.fix}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Context Split Advisor</CardTitle>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="border-b border-white/10 py-3">Field</th>
                  <th className="border-b border-white/10 py-3">Frequency</th>
                  <th className="border-b border-white/10 py-3">Recommended boundary</th>
                </tr>
              </thead>
              <tbody>
                {contextFields.map((field) => (
                  <tr key={field.name}>
                    <td className="border-b border-white/10 py-3 text-slate-200">{field.name}</td>
                    <td className="border-b border-white/10 py-3 text-muted-foreground">{field.frequency}</td>
                    <td className="border-b border-white/10 py-3 text-primary">{field.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardTitle>Memoization Decision Tree</CardTitle>
          <div className="mt-4 space-y-3">
            {memoDecisionQuestions.map((question, index) => (
              <div key={question.label} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-slate-200">{question.label}</span>
                <div className="flex gap-2">
                  {['yes', 'no'].map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setAnswers((current) => ({ ...current, [index]: value }))}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition ${answers[index] === value ? 'border-primary/40 bg-primary/[0.12] text-primary' : 'border-white/10 bg-white/[0.04] text-muted-foreground'}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <MetricCard label="Memo fit score" value={Math.max(0, Math.min(100, memoScore))} tone={memoScore >= 80 ? 'success' : 'warning'} />
          <Card>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <CardTitle>Recommendation</CardTitle>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{recommendation}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-warning" />
              <CardTitle>Render Budget</CardTitle>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Budget warning: keep common interactions under 5 rendered components and under 12ms simulated cost.</p>
          </Card>
        </div>
      </section>

      <Card>
        <CardTitle>Component Responsibility Map</CardTitle>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {responsibilities.map((item) => (
            <div key={item.component} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <p className="font-medium">{item.component}</p>
              </div>
              <dl className="mt-3 space-y-2 text-xs text-muted-foreground">
                <div>UI: {item.ui}</div>
                <div>State: {item.state}</div>
                <div>Data: {item.data}</div>
                <div>Logic: {item.logic}</div>
              </dl>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
