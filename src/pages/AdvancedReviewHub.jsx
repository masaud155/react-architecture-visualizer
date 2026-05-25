import { useMemo, useState } from 'react';
import { Check, Clipboard, Radar, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { createPrReview, getRadarScores, getSavedScenarioSummary } from '../utils/advancedReview.js';

function RadarChart({ scores }) {
  const points = scores.map((score, index) => {
    const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
    const radius = (score.value / 100) * 112;
    return `${140 + Math.cos(angle) * radius},${140 + Math.sin(angle) * radius}`;
  });

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_1fr] xl:items-center">
      <svg viewBox="0 0 280 280" className="mx-auto h-72 w-72">
        {[40, 72, 104].map((radius) => (
          <circle key={radius} cx="140" cy="140" r={radius} fill="none" stroke="rgb(255 255 255 / 0.1)" />
        ))}
        {scores.map((score, index) => {
          const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
          return <line key={score.label} x1="140" y1="140" x2={140 + Math.cos(angle) * 122} y2={140 + Math.sin(angle) * 122} stroke="rgb(255 255 255 / 0.09)" />;
        })}
        <polygon points={points.join(' ')} fill="rgb(20 184 166 / 0.22)" stroke="rgb(20 184 166)" strokeWidth="2" />
      </svg>
      <div className="space-y-3">
        {scores.map((score) => (
          <div key={score.label}>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>{score.label}</span>
              <span>{score.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-primary" style={{ width: `${score.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdvancedReviewHub() {
  const [review, setReview] = useState(() => createPrReview());
  const [copied, setCopied] = useState(false);
  const scores = useMemo(() => getRadarScores(), []);
  const saved = getSavedScenarioSummary();

  async function copyReview() {
    await navigator.clipboard.writeText(review);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Advanced Review"
        title="Architecture smell radar and PR review generator"
        description="Turn simulator evidence into a professional architecture review: radar scoring, saved scenario summaries, and copyable PR feedback."
      >
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="secondary" onClick={() => setReview(createPrReview())}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={copyReview}>
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy PR review'}
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Saved scenarios" value={saved.slots.length} />
        <MetricCard label="Average saved score" value={saved.averageScore || 'N/A'} tone={saved.averageScore > 75 ? 'success' : 'warning'} />
        <MetricCard label="Best score" value={saved.best?.result.score ?? 'N/A'} tone="success" />
        <MetricCard label="Review status" value="Ready" tone="primary" />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_460px]">
        <section className="space-y-4">
          <Card>
            <div className="flex items-center gap-2">
              <Radar className="h-5 w-5 text-primary" />
              <CardTitle>Architecture Smell Radar</CardTitle>
            </div>
            <div className="mt-5">
              <RadarChart scores={scores} />
            </div>
          </Card>

          <Card>
            <CardTitle>Saved Scenario Dashboard</CardTitle>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {saved.slots.map((slot) => (
                <div key={slot.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-100">{slot.name}</p>
                    <Badge tone={slot.result.budgetPass ? 'success' : 'danger'}>{slot.result.score}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{slot.result.renders} renders - {slot.result.cost}ms - {slot.result.efficiency}% efficient</p>
                </div>
              ))}
              {!saved.slots.length ? (
                <p className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-muted-foreground">
                  No What If Studio slots saved yet. Save scenarios there and they will appear here.
                </p>
              ) : null}
            </div>
          </Card>
        </section>

        <Card>
          <CardTitle>Copyable PR Review</CardTitle>
          <pre className="mt-4 h-[720px] overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200">
            {review}
          </pre>
        </Card>
      </div>
    </div>
  );
}
