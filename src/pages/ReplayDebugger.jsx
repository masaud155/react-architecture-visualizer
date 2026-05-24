import { useEffect, useMemo, useState } from 'react';
import { Download, Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { interactionOptions } from '../data/scenarios.js';
import { createReplayReport, getReplayComparison } from '../utils/replayDebugger.js';

function StepPanel({ title, tone, step, total }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone={tone}>{title}</Badge>
          <CardTitle className="mt-3">{step.label}</CardTitle>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.explanation}</p>
        </div>
        <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-muted-foreground">
          {step.index + 1}/{total}
        </span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MetricCard label="Phase" value={step.phase} />
        <MetricCard label="Cost" value={`${step.cost}ms`} tone={tone === 'danger' ? 'warning' : 'success'} />
        <MetricCard label="Wasted" value={step.wasted.length} tone={step.wasted.length ? 'danger' : 'success'} />
      </div>
      <div className="mt-5 space-y-3">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">Necessary renders</p>
          <div className="flex flex-wrap gap-2">
            {step.necessary.map((item) => <Badge key={item} tone="success">{item}</Badge>)}
            {!step.necessary.length ? <Badge tone="muted">none yet</Badge> : null}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">Wasted renders</p>
          <div className="flex flex-wrap gap-2">
            {step.wasted.map((item) => <Badge key={item} tone="danger">{item}</Badge>)}
            {!step.wasted.length ? <Badge tone="muted">none</Badge> : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ReplayDebugger() {
  const [interactionId, setInteractionId] = useState('search');
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const replay = useMemo(() => getReplayComparison(interactionId), [interactionId]);
  const total = Math.max(replay.bad.length, replay.good.length);
  const badStep = replay.bad[Math.min(stepIndex, replay.bad.length - 1)];
  const goodStep = replay.good[Math.min(stepIndex, replay.good.length - 1)];
  const interactionLabel = interactionOptions.find((item) => item.id === interactionId)?.label ?? interactionId;

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setStepIndex((index) => {
        if (index >= total - 1) {
          setPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, total]);

  function reset() {
    setPlaying(false);
    setStepIndex(0);
  }

  function downloadReport() {
    const report = createReplayReport(interactionLabel, badStep, goodStep);
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'render-replay-report.md';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Replay Debugger"
        title="Replay render cascades step by step"
        description="Scrub through an interaction to see user events, state updates, render phases, wasted work, and accumulated cost over time."
      >
        <Button variant="secondary" onClick={downloadReport}>
          <Download className="h-4 w-4" />
          Export replay
        </Button>
      </PageHeader>

      <Card>
        <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="grid gap-3 md:grid-cols-[280px_1fr] md:items-center">
            <select value={interactionId} onChange={(event) => { setInteractionId(event.target.value); reset(); }} className="h-10 rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary">
              {interactionOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
            <input type="range" min={0} max={total - 1} value={stepIndex} onChange={(event) => setStepIndex(Number(event.target.value))} className="w-full accent-teal-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setStepIndex((index) => Math.max(0, index - 1))}><SkipBack className="h-4 w-4" />Prev</Button>
            <Button onClick={() => setPlaying((value) => !value)}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{playing ? 'Pause' : 'Play'}</Button>
            <Button variant="secondary" onClick={() => setStepIndex((index) => Math.min(total - 1, index + 1))}><SkipForward className="h-4 w-4" />Next</Button>
            <Button variant="secondary" onClick={reset}><RotateCcw className="h-4 w-4" />Reset</Button>
            <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="h-10 rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary">
              <option value={1200}>Slow</option>
              <option value={900}>Normal</option>
              <option value={500}>Fast</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <StepPanel title="Bad Architecture Replay" tone="danger" step={badStep} total={replay.bad.length} />
        <StepPanel title="Good Architecture Replay" tone="success" step={goodStep} total={replay.good.length} />
      </div>

      <Card>
        <CardTitle>Timeline Scrubber</CardTitle>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {replay.bad.map((step, index) => (
            <button
              type="button"
              key={step.id}
              onClick={() => setStepIndex(index)}
              className={`rounded-lg border p-3 text-left text-sm transition ${stepIndex === index ? 'border-primary/40 bg-primary/[0.1]' : 'border-white/10 bg-white/[0.035] hover:border-white/20'}`}
            >
              <p className="font-medium text-slate-100">{index + 1}. {step.phase}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{step.label}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
