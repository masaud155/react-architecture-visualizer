import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, GitBranch, Layers, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { RenderFlowCanvas } from '../components/simulator/RenderFlowCanvas.jsx';

const capabilities = [
  { icon: Zap, title: 'Render heatmaps', text: 'See correct, wasted, and idle renders after real interactions.' },
  { icon: GitBranch, title: 'Prop and context flow', text: 'Trace how dependencies travel through component boundaries.' },
  { icon: Layers, title: 'Bad vs good architecture', text: 'Compare ownership choices with measurable render impact.' },
  { icon: BrainCircuit, title: 'Senior-mode reasoning', text: 'Move past tips into maintainability and scaling tradeoffs.' },
];

export function Overview() {
  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center py-6">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Open-source React architecture lab</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">
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
        <RenderFlowCanvas />
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
