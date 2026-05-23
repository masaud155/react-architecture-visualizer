import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, GitBranch, Layers, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { RenderFlowCanvas } from '../components/simulator/RenderFlowCanvas.jsx';
import { Badge } from '../components/ui/Badge.jsx';

const capabilities = [
  { icon: Zap, title: 'Render heatmaps', text: 'See correct, wasted, and idle renders after real interactions.' },
  { icon: GitBranch, title: 'Prop and context flow', text: 'Trace how dependencies travel through component boundaries.' },
  { icon: Layers, title: 'Bad vs good architecture', text: 'Compare ownership choices with measurable render impact.' },
  { icon: BrainCircuit, title: 'Senior-mode reasoning', text: 'Move past tips into maintainability and scaling tradeoffs.' },
];

export function Overview() {
  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="panel flex flex-col justify-center p-6 md:p-8">
          <Badge tone="primary">Open-source React architecture lab</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">
            A visual simulator for React rendering decisions.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Understand how state placement, prop flow, context boundaries, memoization, and list isolation shape performance and maintainability.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/simulator">
                Open simulator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/final-checklist">Review checklist</Link>
            </Button>
          </div>
        </div>
        <div className="panel overflow-hidden p-3">
          <div className="mb-3 flex items-center justify-between px-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Live preview</p>
              <p className="mt-1 text-sm text-slate-200">Interactive architecture graph</p>
            </div>
            <span className="rounded-md border border-primary/25 bg-primary/[0.1] px-2 py-1 text-[11px] text-primary">React Flow</span>
          </div>
          <RenderFlowCanvas />
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard label="Architecture modes" value="2" detail="Bad and good" />
        <MetricCard label="Labs" value="8+" detail="Focused concepts" />
        <MetricCard label="Score model" value="100" detail="Weighted categories" />
        <MetricCard label="Runtime" value="Frontend" detail="No backend" />
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((item) => (
          <Card key={item.title}>
            <item.icon className="h-5 w-5 text-primary" />
            <CardTitle className="mt-4">{item.title}</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
