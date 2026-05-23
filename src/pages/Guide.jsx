import { ArrowRight, CheckCircle2, MousePointerClick, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';

const steps = [
  {
    title: 'Start with RenderFlow Simulator',
    text: 'Pick an interaction, click Trigger Interaction, then watch the graph highlight correct renders in green and wasted renders in red.',
  },
  {
    title: 'Click any component node',
    text: 'Use the inspector to see why that component rendered, which state or prop changed, and whether the render was necessary.',
  },
  {
    title: 'Switch Bad and Good Architecture',
    text: 'Compare the same product behavior with state owned too high versus focused state ownership and smaller render zones.',
  },
  {
    title: 'Change developer mode',
    text: 'Beginner gives simple explanations, Intermediate focuses on render mechanics, and Senior Engineer explains architecture tradeoffs.',
  },
  {
    title: 'Use the labs as drills',
    text: 'Open State Ownership, Prop Flow, Context, Memoization, and List Rendering to isolate one architecture idea at a time.',
  },
  {
    title: 'Finish with the checklist',
    text: 'Use the Final Checklist before shipping a React feature or reviewing a pull request.',
  },
];

const controls = [
  { icon: SlidersHorizontal, label: 'Architecture toggle', text: 'Changes graph structure, render behavior, timeline events, and score.' },
  { icon: MousePointerClick, label: 'Trigger Interaction', text: 'Runs the selected simulation and updates render counts.' },
  { icon: RotateCcw, label: 'Reset', text: 'Resets graph counters, timeline, inspector state, and lab-local selections.' },
];

export function Guide() {
  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <Badge tone="primary">Guide</Badge>
        <h1 className="mt-4 text-3xl font-semibold">How to Use React RenderFlow Simulator</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          This app is an interactive architecture playground. It is best used by comparing the same interaction in bad and good architecture modes, then reading the graph, inspector, timeline, and score together.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/simulator">
              Open simulator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/final-checklist">Open checklist</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {controls.map((control) => (
          <Card key={control.label}>
            <control.icon className="h-5 w-5 text-primary" />
            <CardTitle className="mt-4">{control.label}</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{control.text}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {steps.map((step, index) => (
          <Card key={step.title}>
            <div className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Step {index + 1}</p>
                <CardTitle className="mt-1">{step.title}</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <Card>
        <CardTitle>Recommended learning path</CardTitle>
        <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2 xl:grid-cols-4">
          <Link className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/40 hover:text-primary" to="/state-ownership">1. State Ownership</Link>
          <Link className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/40 hover:text-primary" to="/prop-flow">2. Prop Flow</Link>
          <Link className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/40 hover:text-primary" to="/context-update">3. Context Updates</Link>
          <Link className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/40 hover:text-primary" to="/list-rendering">4. List Rendering</Link>
        </div>
      </Card>
    </div>
  );
}
