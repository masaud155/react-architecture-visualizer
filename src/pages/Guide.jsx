import { ArrowRight, CheckCircle2, ClipboardList, Compass, GitCompare, MousePointerClick, RotateCcw, SquareCode, SlidersHorizontal, Timer, Workflow } from 'lucide-react';
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
    title: 'Open Before vs After',
    text: 'Use the diff page to compare rendered components, wasted renders, simulated cost, efficiency, and architecture score lift side by side.',
  },
  {
    title: 'Tune What If Studio',
    text: 'Adjust state ownership, context scope, memoization, list size, and budgets to see projected render impact live.',
  },
  {
    title: 'Export a report',
    text: 'Generate a Markdown architecture report you can paste into a PR, design review, or learning note.',
  },
  {
    title: 'Build or import a scenario',
    text: 'Use Scenario Builder or JSX Import to review component boundaries from your own product shape.',
  },
  {
    title: 'Use Advisor Suite',
    text: 'Review prop stability, context splitting, memoization fit, render budgets, and component responsibilities.',
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
  { icon: Workflow, label: 'What If Studio', text: 'Tune ownership, context scope, list pressure, memoization, and budgets with live scoring and save slots.' },
  { icon: MousePointerClick, label: 'Trigger Interaction', text: 'Runs the selected simulation and updates render counts.' },
  { icon: Timer, label: 'Render cost', text: 'Adds simulated milliseconds to show why wasted renders matter in larger screens.' },
  { icon: GitCompare, label: 'Before vs After', text: 'Compares bad and good architecture for the same interaction.' },
  { icon: ClipboardList, label: 'Export report', text: 'Creates a Markdown summary of render savings and recommendations.' },
  { icon: Workflow, label: 'Scenario builder', text: 'Create custom component trees or start from SaaS, chat, ecommerce, and dashboard presets.' },
  { icon: SquareCode, label: 'Pro JSX import', text: 'Uses Babel AST parsing to extract component boundaries, edges, prop counts, and inline identity risks.' },
  { icon: Compass, label: 'Advisor suite', text: 'Includes prop stability, context split, memoization, budget, and responsibility advisors.' },
  { icon: RotateCcw, label: 'Reset', text: 'Resets graph counters, timeline, inspector state, and lab-local selections.' },
];

const whatIfWorkflow = [
  {
    label: 'Choose ownership',
    text: 'Start by moving state between App, Dashboard, SearchSection, and LeafComponent to see how ownership changes render scope.',
  },
  {
    label: 'Scope context',
    text: 'Compare Broad AppContext, route providers, split contexts, and local state to understand broadcast cost.',
  },
  {
    label: 'Tune pressure',
    text: 'Adjust list size, memoized children, and split components to model how a screen behaves as the product grows.',
  },
  {
    label: 'Set budgets',
    text: 'Use render and cost budgets to decide whether a design passes before it becomes production code.',
  },
  {
    label: 'Save slots',
    text: 'Save strong architecture variants locally, then reload them later to compare decisions.',
  },
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
          <Button variant="secondary" asChild>
            <Link to="/before-after">Compare before/after</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/what-if-studio">Open What If Studio</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/advisor-suite">Open advisor suite</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {controls.map((control) => (
          <Card key={control.label}>
            <control.icon className="h-5 w-5 text-primary" />
            <CardTitle className="mt-4">{control.label}</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{control.text}</p>
          </Card>
        ))}
      </section>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <Badge tone="primary">Interactive workflow</Badge>
            <CardTitle className="mt-3">How to use What If Studio</CardTitle>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Use this page before or during a refactor. It helps you test architecture choices quickly without editing the graph or writing code.
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/what-if-studio">Launch Studio</Link>
          </Button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {whatIfWorkflow.map((item, index) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/[0.12] text-xs font-semibold text-primary">{index + 1}</span>
              <p className="mt-3 text-sm font-semibold text-slate-100">{item.label}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </Card>

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
          <Link className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/40 hover:text-primary" to="/what-if-studio">5. What If Studio</Link>
          <Link className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/40 hover:text-primary" to="/before-after">6. Before vs After</Link>
          <Link className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/40 hover:text-primary" to="/export-report">7. Export Report</Link>
          <Link className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/40 hover:text-primary" to="/scenario-builder">8. Scenario Builder</Link>
          <Link className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/40 hover:text-primary" to="/advisor-suite">9. Advisor Suite</Link>
        </div>
      </Card>
    </div>
  );
}
