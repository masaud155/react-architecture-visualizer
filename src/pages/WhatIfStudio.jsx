import { useMemo, useState } from 'react';
import { Save, Trash2, Wand2 } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { calculateWhatIf, clearWhatIfSlots, defaultWhatIfState, loadWhatIfSlots, saveWhatIfSlot } from '../utils/whatIfModel.js';

const stateOwners = ['App', 'Dashboard', 'SearchSection', 'LeafComponent'];
const contextScopes = ['Broad AppContext', 'Route Provider', 'Split Contexts', 'Local State'];

function RangeControl({ label, value, min, max, step = 1, suffix = '', onChange }) {
  return (
    <label className="block rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <span className="font-mono text-xs text-primary">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-teal-400"
      />
    </label>
  );
}

export function WhatIfStudio() {
  const [model, setModel] = useState(defaultWhatIfState);
  const [slots, setSlots] = useState(() => loadWhatIfSlots());
  const result = useMemo(() => calculateWhatIf(model), [model]);

  function update(key, value) {
    setModel((current) => ({ ...current, [key]: value }));
  }

  function saveSlot() {
    setSlots(saveWhatIfSlot({ model, result, name: `${model.stateOwner} / ${model.contextScope}` }));
  }

  function clearSlots() {
    setSlots(clearWhatIfSlots());
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="What If Studio"
        title="Tune architecture decisions and watch the impact live"
        description="Experiment with ownership, memoization, context scope, list pressure, component splits, and render budgets before touching production code."
      >
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="secondary" onClick={() => setModel(defaultWhatIfState)}>Reset model</Button>
          <Button onClick={saveSlot}>
            <Save className="h-4 w-4" />
            Save slot
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Projected renders" value={result.renders} tone={result.renders <= model.renderBudget ? 'success' : 'danger'} />
        <MetricCard label="Wasted renders" value={result.wasted} tone={result.wasted ? 'warning' : 'success'} />
        <MetricCard label="Render cost" value={`${result.cost}ms`} tone={result.cost <= model.costBudget ? 'success' : 'danger'} />
        <MetricCard label="Efficiency" value={`${result.efficiency}%`} tone={result.efficiency > 70 ? 'success' : 'warning'} />
        <MetricCard label="Score" value={result.score} tone={result.score > 75 ? 'success' : 'warning'} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card>
          <CardTitle>Architecture Inputs</CardTitle>
          <div className="mt-5 space-y-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">State owner</p>
              <div className="grid grid-cols-2 gap-2">
                {stateOwners.map((owner) => (
                  <button
                    type="button"
                    key={owner}
                    onClick={() => update('stateOwner', owner)}
                    className={`rounded-md border px-3 py-2 text-sm transition ${model.stateOwner === owner ? 'border-primary/40 bg-primary/[0.12] text-primary' : 'border-white/10 bg-white/[0.035] text-muted-foreground hover:text-slate-100'}`}
                  >
                    {owner}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">Context scope</p>
              <div className="grid gap-2">
                {contextScopes.map((scope) => (
                  <button
                    type="button"
                    key={scope}
                    onClick={() => update('contextScope', scope)}
                    className={`rounded-md border px-3 py-2 text-left text-sm transition ${model.contextScope === scope ? 'border-primary/40 bg-primary/[0.12] text-primary' : 'border-white/10 bg-white/[0.035] text-muted-foreground hover:text-slate-100'}`}
                  >
                    {scope}
                  </button>
                ))}
              </div>
            </div>

            <RangeControl label="Memoized children" value={model.memoizedChildren} min={0} max={8} onChange={(value) => update('memoizedChildren', value)} />
            <RangeControl label="Split components" value={model.splitComponents} min={0} max={8} onChange={(value) => update('splitComponents', value)} />
            <RangeControl label="List size" value={model.listSize} min={10} max={500} step={10} onChange={(value) => update('listSize', value)} />
            <RangeControl label="Render budget" value={model.renderBudget} min={2} max={30} onChange={(value) => update('renderBudget', value)} />
            <RangeControl label="Cost budget" value={model.costBudget} min={4} max={60} suffix="ms" onChange={(value) => update('costBudget', value)} />
          </div>
        </Card>

        <section className="space-y-4">
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge tone={result.budgetPass ? 'success' : 'danger'}>{result.budgetPass ? 'Budget pass' : 'Budget fail'}</Badge>
                <CardTitle className="mt-3">Live What If Result</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Current model: {model.stateOwner} owns interaction state, context scope is {model.contextScope}, and the list has {model.listSize} rows.
                </p>
              </div>
              <Wand2 className="h-6 w-6 text-primary" />
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {result.recommendations.map((recommendation) => (
                <div key={recommendation} className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-200">
                  {recommendation}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Saved Scenario Slots</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearSlots}>
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {slots.map((slot) => (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => setModel(slot.model)}
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-left transition hover:border-primary/35"
                >
                  <p className="text-sm font-medium text-slate-100">{slot.name}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Score {slot.result.score} - {slot.result.renders} renders - {slot.result.cost}ms</p>
                </button>
              ))}
              {!slots.length ? <p className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-muted-foreground">No saved slots yet. Tune the model and save a scenario.</p> : null}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
