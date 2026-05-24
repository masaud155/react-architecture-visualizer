import { useMemo, useState } from 'react';
import { Plus, Wand2 } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { MetricCard } from '../components/ui/MetricCard.jsx';
import { scenarioPresets } from '../data/featureData.js';

export function ScenarioBuilder() {
  const [presetId, setPresetId] = useState('ecommerce');
  const [customName, setCustomName] = useState('');
  const [customComponents, setCustomComponents] = useState([]);
  const preset = scenarioPresets.find((item) => item.id === presetId);
  const components = customComponents.length ? customComponents : preset.components;
  const score = useMemo(() => Math.max(42, 92 - components.length * 5), [components]);

  function addComponent() {
    if (!customName.trim()) return;
    setCustomComponents((items) => [...items, customName.trim()]);
    setCustomName('');
  }

  return (
    <div className="space-y-4">
      <PageHeader eyebrow="Builder" title="Custom Scenario Builder" description="Sketch your own component tree, estimate render risk, and turn product screens into simulator-ready architecture scenarios." />

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle>Preset Templates</CardTitle>
          <div className="mt-4 space-y-2">
            {scenarioPresets.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setPresetId(item.id);
                  setCustomComponents([]);
                }}
                className={`w-full rounded-lg border p-3 text-left text-sm transition ${presetId === item.id ? 'border-primary/40 bg-primary/[0.1] text-primary' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20'}`}
              >
                <span className="font-medium">{item.name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{item.domain}</span>
              </button>
            ))}
          </div>
        </Card>

        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard label="Components" value={components.length} />
            <MetricCard label="Estimated score" value={score} tone={score > 70 ? 'success' : 'warning'} />
            <MetricCard label="Render risk" value={score > 70 ? 'Medium' : 'High'} tone={score > 70 ? 'warning' : 'danger'} />
          </div>

          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge tone="primary">{customComponents.length ? 'Custom scenario' : preset.name}</Badge>
                <CardTitle className="mt-3">Component Tree Draft</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{customComponents.length ? 'Custom components added manually.' : preset.risk}</p>
              </div>
              <div className="flex gap-2">
                <input
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="ComponentName"
                  className="h-10 min-w-0 rounded-md border border-white/10 bg-slate-950 px-3 text-sm outline-none focus:border-primary"
                />
                <Button onClick={addComponent}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {components.map((component, index) => (
                <div key={`${component}-${index}`} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-sm font-semibold">{component}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{index === 0 ? 'Root owner candidate' : index < 3 ? 'Section boundary' : 'Leaf render boundary'}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              <CardTitle>Generated Recommendation</CardTitle>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Keep interaction state inside section boundaries, memoize expensive leaf lists only after props are stable, and avoid putting all screen state in {components[0]}.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
